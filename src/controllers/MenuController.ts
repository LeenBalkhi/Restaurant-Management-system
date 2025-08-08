import { Request, Response } from "express";
import { getConnection, getRepository } from "typeorm";
import { validate } from "class-validator";
import { Menu } from "../entity/Menu";
import { Section } from "../entity/Section";
import { Meals } from "../entity/Meal";

class MenuController {
  static listAll = async (req: Request, res: Response) => {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    const menu = await queryRunner.manager
      .createQueryBuilder()
      .select("Menu")
      .from(Menu, "Menu")
      .getMany();

    res.send(menu);
  };
  static getOneById = async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    try {
      const menu = await queryRunner.manager
        .createQueryBuilder()
        .select("Menu")
        .from(Menu, "Menu")
        .where("Menu.id= :ids", { ids: id })
        .getOne();
      res.send(menu);
    } catch (error) {
      res.status(404).send({ message: "menu not found", error: error });
    }
  };
  static newMenu = async (req: Request, res: Response) => {
    let { name } = req.body.name;
    const menu = new Menu();
    menu.name = name;

    //Validade if the parameters are ok
    const errors = await validate(menu);
    if (errors.length > 0) {
      res.status(400).send({ error: errors });
      return;
    }
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");

    let newMenu;
    try {
      newMenu = await queryRunner.manager.save(menu);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      res
        .status(409)
        .send({
          message: "menu creation was unsuccessful, it already exists",
          error: err,
        });
    } finally {
      await queryRunner.release();
      res.status(201).send({ message: "menu created", menu: newMenu });
    }
  };
  static editMenu = async (req: Request, res: Response) => {
    const id = req.params.id;
    const { name } = req.body;
    let menu, newMenu;

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    try {
      const menu = await queryRunner.manager
        .createQueryBuilder()
        .select("Menu")
        .from(Menu, "Menu")
        .where("Menu.id= :ids", { ids: id })
        .getOne();
    } catch (error) {
      res.status(404).send({ message: "menu not found", error: error });
    }
    menu.name = name;
    const errors = await validate(menu);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");

    try {
      newMenu = await queryRunner.manager.save(menu);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      res
        .status(409)
        .send({ message: "menu edit was unsuccessful", error: err });
    } finally {
      await queryRunner.release();
      res.status(201).send({ message: "menu created", menu: newMenu });
    }
  };
  static deleteMenu = async (req: Request, res: Response) => {
    const id = req.params.id;
    let menu;

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    try {
      menu = await connection
        .createQueryBuilder()
        .select("Menu")
        .from(Menu, "Menu")
        .where("Menu.id= :ids", { ids: id })
        .getMany();
    } catch (error) {
      res.status(404).send("menu not found");
    }
    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");

    try {
      await queryRunner.manager.remove(menu);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      res.status(409).send("menu deletion was unsuccessful");
    } finally {
      await queryRunner.release();
      res.status(201).send("menu deleted");
    }
  };

  static getMealAndSectionByMenuId = async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    try {
      const menu = await queryRunner.manager
        .createQueryBuilder()
        .select("menu")
        .from(Menu, "menu")
        .where("menu.id= :ids", { ids: id })
        .getOne();
      if (menu != null) {
        const section = await queryRunner.manager
          .createQueryBuilder()
          .select("Section")
          .from(Section, "Section")
          .where("Section.menuId= :ids", { ids: id })
          .getMany();
        if (section.length != 0) {
          const meals = await queryRunner.manager
            .createQueryBuilder()
            .select("Meals")
            .from(Meals, "Meals")
            .where("Meals.available=1 and Meals.sectionId= :ids", {
              ids: section[0].id,
            })
            .getMany();
          section[0].meals = meals;
        }
        menu.sections = section;
        res.send(menu);
        return;
      } else {
        res.status(404).send({ message: "menu not found" });
      }
    } catch (error) {
      res.status(404).send({ message: "menu not found", error: error });
    }
  };
}

export default MenuController;
