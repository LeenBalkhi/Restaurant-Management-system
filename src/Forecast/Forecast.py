import pandas as pd
import numpy as np
from typing import List, Dict
from statsmodels.tsa.statespace.sarimax import SARIMAX
from datetime import datetime, timedelta

class InventoryForecaster:
    def __init__(self, seasonal: bool = True):
        self.models = {}
        self.seasonal = seasonal

    def train(self, data: pd.DataFrame):
        """
        Trains a model for each item.
        Expects data with columns: ['date', 'item', 'quantity']
        """
        data['date'] = pd.to_datetime(data['date'])
        grouped = data.groupby('item')

        for item, group in grouped:
            daily = group.groupby('date').sum().resample('D').sum().fillna(0)
            if len(daily) < 30:
                print(f"Not enough data to train for item: {item}")
                continue
            order = (1, 1, 1)
            seasonal_order = (1, 1, 1, 7) if self.seasonal else (0, 0, 0, 0)

            model = SARIMAX(daily['quantity'], order=order, seasonal_order=seasonal_order, enforce_stationarity=False, enforce_invertibility=False)
            fitted_model = model.fit(disp=False)
            self.models[item] = (fitted_model, daily.index)

    def forecast(self, days_ahead: int = 7) -> Dict[str, float]:
        """
        Forecast demand for each item for the next `days_ahead` days.
        Returns a dict {item: forecast_total_quantity}
        """
        recommendations = {}
        for item, (model, index) in self.models.items():
            forecast = model.forecast(steps=days_ahead)
            recommendations[item] = forecast.sum()
        return recommendations

    def recommend_purchases(self, current_stock: Dict[str, float], forecast_horizon: int = 7) -> Dict[str, float]:
        """
        Compares forecast to stock and recommends what to purchase.
        Returns {item: purchase_amount}
        """
        forecasted = self.forecast(forecast_horizon)
        to_order = {}

        for item, demand in forecasted.items():
            stock = current_stock.get(item, 0)
            needed = demand - stock
            if needed > 0:
                to_order[item] = round(needed)
        return to_order
