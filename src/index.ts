#!/usr/bin/env node

import { Command } from 'commander';
// FIX: Changed all import extensions from .ts to .js
import { clone } from './commands/clone.js';
import { build } from './commands/build.js';
import { install } from './commands/install.js';
import { list } from './commands/list.js';

const program = new Command();

program
  .name("donut")
  .description("🧁 Donut CLI - یک ابزار ساده برای مدیریت پروژه‌های شما")
  .version("1.0.0");

program
  .command('clone')
  .description('یک ریپازیتوری از قالب‌های پروژه را کلون می‌کند')
  .argument('<project>', 'نام پروژه (ریپازیتوری) برای کلون کردن')
  .option('-u, --user <username>', 'نام کاربری گیت‌هاب مالک ریپازیتوری', 'unknownmsv')
  .action(clone);

program
  .command('build')
  .description('پروژه را بر اساس فایل donut.ts بیلد و اجرا می‌کند')
  .action(build);
  
program
  .command('install <package>')
  .description('نصب یک پکیج از لیست پکیج‌های Donut')
  .action(install);

program
  .command('list')
  .description('نمایش تمام پکیج‌های قابل نصب')
  .action(list);

program.parse(process.argv);

if (!program.args.length) {
  program.help();
}
