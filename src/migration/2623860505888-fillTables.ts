// import {getRepository, MigrationInterface, QueryRunner, Table} from "typeorm";
// import { Bills } from "../entity/Bills";
// import { Booking } from "../entity/Booking";
// import { Categories } from "../entity/Categories";
// import { ingredients } from "../entity/Ingredients";
// import { Meals } from "../entity/Meal";
// import { MealIngredients } from "../entity/MealIngredients";
// import { MealOffer } from "../entity/MealOffer";
// import { Menu } from "../entity/Menu";
// import { Offers } from "../entity/Offers";
// import { OrderMeals } from "../entity/OrderMeals";
// import { Orders } from "../entity/Orders";
// import { Section } from "../entity/Section";
// import { StockIngredient } from "../entity/StockIngredient";
// import { SubOrder } from "../entity/SubOrder";
// import { SubOrderIngredient } from "../entity/SubOrderIngredient";
// import { Resttables } from "../entity/Table";
// import {state} from "../entity/Table";
// export class fillTables1623860505888 implements MigrationInterface {

//     public async up(queryRunner: QueryRunner): Promise<void> {
//         //fill tables;
//       // await queryRunner.query("Insert into bills(total, discount, fee, totalWithFee,type ) values (3000, 0, 400, 3400, \"bill\")");
//       // await queryRunner.query("Insert into resttables(TableNumber, state) values (3,\"booked\" )");
//        await queryRunner.query("Insert into stock() values() ");
//        //await queryRunner.query("Insert into booking(name, time, date) values (\"someone\", \"12:00\",'2021-6-6')");
//        await queryRunner.query("Insert into ingredients(name, measurment, price, quantity,minthreshold) values(\"potato\",\"KG\", 4000, 70, 50)");
//        await queryRunner.query("Insert into meals(name,description, price) values (\"fries\",\"fried potato\",3000)");
//        await queryRunner.query("Insert into menu(name) values (\"Menu\")");
//        await queryRunner.query("Insert into section(name) values (\"Appetizers\")");
//        await queryRunner.query("Insert into meal_Ingredients(quantity) values (1)");
//        await queryRunner.query("Insert into order_Meals(quantity ) values (1)");
//        await queryRunner.query("Insert into stock_Ingredient(expirationDate,quantity,price) values ('2022-6-6',3,3.3)");
    
//      //    queryRunner.startTransaction();
//     //    await queryRunner.query("Insert into Bills(total, discount, fee, totalWithFee,type ) values (3000, 0, 400, 3400, \"bill\")");
//     //    await queryRunner.commitTransaction();
      
//     //    queryRunner.startTransaction();
//     //    await queryRunner.query("Insert into Resttables(TableNumber, state) values (3,\"booked\" )");
//     //    await queryRunner.commitTransaction();
       
//     //    queryRunner.startTransaction();
//     //    await queryRunner.query("Insert into Booking(name, time, date,table, Bill) values (\"someone\", \"12:00\",'2021-6-6',1,1)");
//     //    await queryRunner.commitTransaction();
       
//     //    queryRunner.startTransaction();
//     //    await queryRunner.query("Insert into ingredients(name, measurment, price, quantity,minthreshold) values(\"potato\",\"KG\", 4000, 70, 50)");
//     //    await queryRunner.commitTransaction();
       
//     //    queryRunner.startTransaction();
//     //    await queryRunner.query("Insert into Meals(name,description, price) values (\"fries\",\"fried potato\",3000)");
//     //    await queryRunner.commitTransaction();
       
//     //    queryRunner.startTransaction();
//     //    await queryRunner.query("Insert into Menu(name) values (\"Menu\")");
//     //    await queryRunner.commitTransaction();
       
//     //    queryRunner.startTransaction();
//     //    await queryRunner.query("Insert into Section(name, Menu), values (\"Appetizers\",1)");
//     //    await queryRunner.commitTransaction();
       
//     //    queryRunner.startTransaction();
//     //    await queryRunner.query("update Meals set section=1 where id=1");
//     //    await queryRunner.commitTransaction();
       
//     //    queryRunner.startTransaction();
//     //    await queryRunner.query("Insert into MealIngredients(quantity, meal, ingredient) values (1,1,1)");
//     //    await queryRunner.commitTransaction();
       
//     //    queryRunner.startTransaction();
//     //    await queryRunner.query("Insert into Orders(Bill) values (1)");
//     //    await queryRunner.commitTransaction();
       
//     //    queryRunner.startTransaction();
//     //    await queryRunner.query("Insert into OrderMeals(quantity, unitprice, Meals, Orders) values (1,3000, 1 ,1)");
//     //    await queryRunner.commitTransaction();
       
//     //    queryRunner.startTransaction();
//     //    await queryRunner.query("Insert into stockIngredient(expirationDate,quantity,ingredients) values ('2022-6-6',3,1)");
//     //    await queryRunner.commitTransaction();
//     }

//     public async down(queryRunner: QueryRunner): Promise<void> {
//     }

// }
