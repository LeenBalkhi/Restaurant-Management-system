import { Request, Response } from "express";
import { getConnection, getRepository } from "typeorm";
import { validate } from "class-validator";

import { Categories } from "../entity/Categories";

class CategoriesController{

    static listAll = async (req: Request, res: Response) => {
      const connection = getConnection();
      const queryRunner = connection.createQueryRunner();
      //Get categorys from database
      
      const categories =  await queryRunner.manager.createQueryBuilder().
            select("Categories").from(Categories, "Categories").getMany();
      //Send the categorys object
      res.send(categories);
    };

    static getOneById = async (req: Request, res: Response) => {
      //Get the ID from the url
      const id: string = req.params.id;
      const connection = getConnection();
      const queryRunner = connection.createQueryRunner();
      //Get the category from database
      try {
        const category = await queryRunner.manager.createQueryBuilder().
        select("Categories").from(Categories, "Categories").where("Categories.id= :ids", {ids : id}).getMany(); 
        res.send(category);
       } catch (error) {
        res.status(404).send("category not found");
      }
    };   

    static newcategory = async (req: Request, res: Response) => {
        //Get parameters from the body
      let { category } = req.body;
      let newCategory = new Categories();
      newCategory.category = category;
        
      //Validade if the parameters are ok
      const errors = await validate(newCategory);
      if (errors.length > 0) {
        res.status(400).send(errors);
        return;
      }

    
            const connection = getConnection();
            const queryRunner = connection.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction("SERIALIZABLE");
    
            try {
                await queryRunner.manager.save(newCategory);
                await queryRunner.commitTransaction();
            
            } catch (err) {
                await queryRunner.rollbackTransaction();
                res.status(409).send("category creation was unsuccessful, it already exists");
            
            } finally {
                await queryRunner.release();
                res.status(201).send("category created");
        }
    };

    static editCategory = async (req: Request, res: Response)=>{
    //Get the ID from the url
        const id = req.params.id;
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        //Get values from the body
        const { category } = req.body;

        //Try to find category on database
        let newCategory;
        try {
          newCategory = await queryRunner.manager.createQueryBuilder().
          select("Categories").from(Categories, "Categories").where("Categories.id= :ids", {ids : id}).getMany(); 
          } catch (error) {
          //If not found, send a 404 response
          res.status(404).send("category not found");
          return;
        }
      
        //Validate the new values on model
        newCategory.category = category;
        const errors = await validate(newCategory);
        if (errors.length > 0) {
          res.status(400).send(errors);
          return;
        }
      
        await queryRunner.connect();
        await queryRunner.startTransaction("SERIALIZABLE");
      
        try {
            await queryRunner.manager.save(newCategory);
            await queryRunner.commitTransaction();
        
        } catch (err) {
            await queryRunner.rollbackTransaction();
            res.status(409).send("category edit was unsuccessful");
        
        } finally {
            await queryRunner.release();
            res.status(201).send("category created");
        }  
    };

    static deleteCategory = async (req: Request , res: Response)=>{
        //Get the ID from the url
        const id = req.params.id;

        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        let newCategory;
        try {
          newCategory = await queryRunner.manager.createQueryBuilder().
          select("Categories").from(Categories, "Categories").where("Categories.id= :ids", {ids : id}).getMany(); 
           } catch (error) {
          res.status(404).send("category not found");
          return;
        }
        await queryRunner.connect();
              await queryRunner.startTransaction("SERIALIZABLE");
      
              try {
                  await queryRunner.manager.remove(newCategory);
                  await queryRunner.commitTransaction();
              
              } catch (err) {
                  await queryRunner.rollbackTransaction();
                  res.status(409).send("category deletion was unsuccessful");
              
              } finally {
                  await queryRunner.release();
                  res.status(201).send("category deleted");
              }
    };
}

export default CategoriesController;