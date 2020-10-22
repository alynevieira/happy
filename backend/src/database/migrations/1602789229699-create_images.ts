import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createImages1602789229699 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'images',
      columns: [
        {
          name: 'id',
          type: 'integer',
          unsigned: true, // não pode ser negativa
          isPrimary: true, // chave primaria
          isGenerated: true, // coluna gerada automaticamente
          generationStrategy: 'increment' // gerada auto. incrementando
        },
        {
          name: 'path',
          type: 'varchar'
        },
        {
          name: 'orphanage_id',
          type: 'integer'
        }
      ],
      foreignKeys: [ // chave estrangeira
        {
          name: 'ImageOrphanage',
          columnNames: ['orphanage_id'],
          referencedTableName: 'orphanages',
          referencedColumnNames: ['id'],
          onUpdate: 'CASCADE', // ele muda caso o id for alterado
          onDelete: 'CASCADE'
        }
      ]
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('images')
  }

}
