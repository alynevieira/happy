import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createOrphanages1602782617096 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'orphanages',
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
          name: 'name',
          type: 'varchar'
        },
        {
          name: 'latitude',
          type: 'decimal',
          scale: 10, // numeros depois da virgula
          precision: 2
        },
        {
          name: 'longitude',
          type: 'decimal',
          scale: 10, // numeros depois da virgula
          precision: 2
        },
        {
          name: 'about',
          type: 'text'
        },
        {
          name: 'instructions',
          type: 'text'
        },
        {
          name: 'opening_hours',
          type: 'varchar'
        },
        {
          name: 'open_on_weekends',
          type: 'boolean',
          default: false
        }
      ]
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('orphanages')
  }

}
