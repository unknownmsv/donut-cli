#!/usr/bin/env node

import { Command } from 'commander'
import { clone } from './commands/clone.ts'
import { build } from './commands/build.ts'

const program = new Command()

program
  .name("donut")
  .description("🧁 Donut CLI - یک ابزار ساده برای مدیریت پروژه‌های شما")
  .version("1.0.0")

program
  .command('clone')
  .description('یک ریپازیتوری از قالب‌های پروژه را کلون می‌کند')
  .argument('<project>', 'نام پروژه (ریپازیتوری) برای کلون کردن')
  .option('-u, --user <username>', 'نام کاربری گیت‌هاب مالک ریپازیتوری', 'unknownmsv')
  .action(clone)

program
  .command('build')
  .description('پروژه را بر اساس فایل donut.ts بیلد و اجرا می‌کند')
  .action(build)

program.parse(process.argv)

if (!program.args.length) {
  program.help()
}
