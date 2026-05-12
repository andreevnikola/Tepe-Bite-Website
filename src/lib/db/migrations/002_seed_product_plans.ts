import { MigrationInterface, QueryRunner } from 'typeorm'

export class SeedProductPlans1747008000002 implements MigrationInterface {
  name = 'SeedProductPlans1747008000002'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "product_plans"
        ("id", "slug", "titleBg", "titleEn", "packSize", "descriptionBg", "descriptionEn",
         "priceCents", "currency", "isActive", "sortOrder", "createdAt", "updatedAt")
      VALUES
        (
          gen_random_uuid(),
          '10-bars',
          'Пакет 10 блокчета',
          'Pack of 10 bars',
          10,
          'Пакет от 10 солено-карамелени блокчета ТЕПЕ bite.',
          'Pack of 10 ТЕПЕ bite salted caramel bars.',
          0,
          'EUR',
          FALSE,
          1,
          NOW(),
          NOW()
        ),
        (
          gen_random_uuid(),
          '20-bars',
          'Пакет 20 блокчета',
          'Pack of 20 bars',
          20,
          'Пакет от 20 солено-карамелени блокчета ТЕПЕ bite.',
          'Pack of 20 ТЕПЕ bite salted caramel bars.',
          0,
          'EUR',
          FALSE,
          2,
          NOW(),
          NOW()
        ),
        (
          gen_random_uuid(),
          '35-bars',
          'Пакет 35 блокчета',
          'Pack of 35 bars',
          35,
          'Пакет от 35 солено-карамелени блокчета ТЕПЕ bite.',
          'Pack of 35 ТЕПЕ bite salted caramel bars.',
          0,
          'EUR',
          FALSE,
          3,
          NOW(),
          NOW()
        )
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "product_plans" WHERE "slug" IN ('10-bars', '20-bars', '35-bars')
    `)
  }
}
