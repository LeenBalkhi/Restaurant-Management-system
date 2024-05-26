import { Request, Response } from "express";
import { getConnection, getRepository } from "typeorm";
import { validate } from "class-validator";
import { Section } from "../entity/Section";
import { Menu } from "../entity/Menu";

class SectionController {
  static listAll = async (req: Request, res: Response) => {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    const section = await queryRunner.manager
      .createQueryBuilder()
      .select("Section")
      .from(Section, "Section")
      .getMany();

    res.send(section);
  };

  static getOneById = async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    try {
      const section = await queryRunner.manager
        .createQueryBuilder()
        .select("Section.id , Section.name, Section.menuId")
        .from(Section, "Section")
        .where("Section.id= :ids", { ids: id })
        .getOne();
      res.send(section);
    } catch (error) {
      res.status(404).send({ message: "Section not found", error: error });
    }
  };
  static newSection = async (req: Request, res: Response) => {
    let newSection,
      reqSection = req.body;
    const section = new Section();
    section.name = reqSection.name;

    //Validade if the parameters are ok
    const errors = await validate(section);
    if (errors.length > 0) {
      res.status(400).send({ error: errors });
      return;
    }
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");

    try {
      if (reqSection.menuId != null) section.menu = reqSection.menuId;
      else {
        let menu: Menu = await queryRunner.manager
          .createQueryBuilder()
          .select("Menu")
          .from(Menu, "Menu")
          .where("Menu.id= :ids", { ids: 1 })
          .getOneOrFail();
        section.menu = menu;
      }

      newSection = await queryRunner.manager.save(section);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      res
        .status(409)
        .send({
          message: "section creation was unsuccessful, it already exists",
          error: err,
        });
    } finally {
      await queryRunner.release();
      reqSection.id = newSection.id;
      res.status(201).send({ message: "section created", section: reqSection });
    }
  };
  static editSection = async (req: Request, res: Response) => {
    const id = req.params.id;
    const reqSection = req.body;
    let section, newSection;

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    try {
      const section = await queryRunner.manager
        .createQueryBuilder()
        .select("Section")
        .from(Section, "Section")
        .where("Section.id= :ids", { ids: id })
        .getOneOrFail();
    } catch (error) {
      res.status(404).send("Section not found");
    }
    if (reqSection.name != null) section.name = reqSection.name;
    if (reqSection.menu != null) section.Menu = reqSection.Menu;
    const errors = await validate(section);
    if (errors.length > 0) {
      res.status(400).send({ error: errors });
      return;
    }
    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");

    try {
      newSection = await queryRunner.manager.save(section);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      res
        .status(409)
        .send({ message: "section edit was unsuccessful", error: err });
    } finally {
      await queryRunner.release();
      res.status(201).send({ message: "section created", section: newSection });
    }
  };
  static deleteSection = async (req: Request, res: Response) => {
    const id = req.params.id;
    let section;

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    try {
      section = await connection
        .createQueryBuilder()
        .select("Section")
        .from(Section, "Section")
        .where("Section.id= :ids", { ids: id })
        .getMany();
    } catch (error) {
      res.status(404).send("Section not found");
    }
    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");

    try {
      await queryRunner.manager.remove(section);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      res.status(409).send("Section deletion was unsuccessful");
    } finally {
      await queryRunner.release();
      res.status(201).send("Section deleted");
    }
  };
}

export default SectionController;
