#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/920a87b50729a867e21706dd0fa5c3739e273a84ed89eb2f3525633b2d6ef85c/contract';
import startContract from '../../snapshots/920a87b50729a867e21706dd0fa5c3739e273a84ed89eb2f3525633b2d6ef85c/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/f1e9415acf588d2bda013da7f73cf0a960878951d3ac81e729e567a9e5811683/contract';
import endContract from '../../snapshots/f1e9415acf588d2bda013da7f73cf0a960878951d3ac81e729e567a9e5811683/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  primaryKey,
  sql,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropTable({ schema: 'public', table: 'Post' }),
      this.dropColumn({ schema: 'public', table: 'User', column: 'createdAt' }),
      this.dropColumn({ schema: 'public', table: 'User', column: 'updatedAt' }),
      this.dropColumn({ schema: 'public', table: 'User', column: 'username' }),
      this.createTable({
        schema: 'public',
        table: 'Merchant',
        columns: [
          col('auth_type', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('password', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'Merchant_auth_type_check_0380e3da',
            sql`"auth_type" IN ('Google', 'Github')`,
          ),
        ],
      }),
      this.addRequiredColumnToEmptyTable({
        schema: 'public',
        table: 'User',
        column: 'number',
        type: 'text',
      }),
      this.addColumnWithTemporaryDefault({
        schema: 'public',
        table: 'User',
        column: 'password',
        type: 'text',
        temporaryDefault: sql`''`,
      }),
      this.addUnique({
        schema: 'public',
        table: 'User',
        constraint: 'User_number_key',
        columns: ['number'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
