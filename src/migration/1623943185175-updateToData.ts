import {MigrationInterface, QueryRunner} from "typeorm";

export class updateToData1623943185175 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

      //   await queryRunner.query("insert into orders() values()");
      // //  await queryRunner.query("update booking set tableId=1 where id=1");
      //   await queryRunner.query("update section set menuId=1 where id=1");
      //   await queryRunner.query("update meals set sectionId=1 where id=1");
      //   //await queryRunner.query("update bills set orderId=1, bookingId=1 where id=1");
      //   await queryRunner.query("update meal_ingredients set mealId=1, ingredientId=1 where id=1");
      //   await queryRunner.query("update order_meals set mealsId=1, ordersId=1 where id=1");
      //   await queryRunner.query("update stock_ingredient set ingredientsId=1 where id=1");
      //   await queryRunner.query("update stock_ingredient set stockId=1 where id=1");

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
