// commands/install.ts
import axios from 'axios';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import ora from 'ora';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { list } from './list'; // برای نمایش پکیج‌های مشابه در صورت خطا

const API_URL = 'https://package.unknownmsv.ir/api/packages.json';

// یک مجموعه برای جلوگیری از نصب تکراری وابستگی‌ها در یک اجرا
const installedPackages = new Set<string>();

export async function install(pkgName: string, options: any) {
  if (installedPackages.has(pkgName)) {
    console.log(chalk.yellow(`🟡 پکیج "${pkgName}" قبلاً به عنوان وابستگی نصب شده است.`));
    return;
  }

  const spinner = ora(`در حال یافتن پکیج "${pkgName}"...`).start();

  try {
    // ۱. دریافت اطلاعات همه پکیج‌ها
    const response = await axios.get(API_URL);
    const packages = response.data.packages;
    
    const pkgInfo = packages[pkgName];

    if (!pkgInfo) {
      spinner.fail(chalk.red(`پکیج "${pkgName}" یافت نشد!`));
      console.log(chalk.blue('آیا منظورتان یکی از این پکیج‌ها بود؟'));
      // نمایش لیست پکیج‌ها برای راهنمایی کاربر
      await list();
      return;
    }

    spinner.succeed(chalk.green(`پکیج "${pkgInfo.name}" پیدا شد.`));

    // ۲. نصب وابستگی‌ها (Dependencies) به صورت بازگشتی
    if (pkgInfo.dependencies && pkgInfo.dependencies.length > 0) {
      console.log(chalk.cyan(`\n🔗 این پکیج به موارد زیر نیاز دارد: ${pkgInfo.dependencies.join(', ')}`));
      for (const dep of pkgInfo.dependencies) {
        await install(dep, options); // فراخوانی بازگشتی برای نصب وابستگی
      }
      console.log(chalk.cyan(`\nادامه نصب "${pkgInfo.name}"...`));
    }

    // ۳. دریافت تایید از کاربر برای اجرای اسکریپت
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: `آیا برای نصب ${pkgInfo.name} (نسخه ${pkgInfo.latest_version}) و اجرای اسکریپت از ${pkgInfo.download_url} مطمئن هستید؟`,
        default: true,
      },
    ]);

    if (!confirm) {
      console.log(chalk.yellow('نصب لغو شد.'));
      return;
    }

    // ۴. دانلود و اجرای امن اسکریپت
    const installSpinner = ora(`در حال دانلود و نصب ${pkgInfo.name}...`).start();
    
    const scriptResponse = await axios.get(pkgInfo.download_url, { responseType: 'text' });
    const installScriptContent = scriptResponse.data;

    // ایجاد یک فایل موقت برای اسکریپت
    const tempDir = os.tmpdir();
    const scriptPath = path.join(tempDir, `donut-install-${pkgName}.sh`);
    
    fs.writeFileSync(scriptPath, installScriptContent);
    fs.chmodSync(scriptPath, '755'); // دادن دسترسی اجرا به فایل

    // اجرای اسکریپت در یک فرآیند جداگانه (بسیار امن‌تر از eval)
    execSync(scriptPath, { stdio: 'inherit' });

    // پاک کردن فایل موقت
    fs.unlinkSync(scriptPath);

    installSpinner.succeed(chalk.green(`✅ ${pkgInfo.name} با موفقیت نصب شد!`));
    installedPackages.add(pkgName);

  } catch (error) {
    spinner.fail(chalk.red('❌ خطا در هنگام نصب:'));
    if (axios.isAxiosError(error)) {
      console.error(chalk.red(`- خطای شبکه: ${error.message}`));
    } else if (error instanceof Error) {
        console.error(chalk.red(`- ${error.message}`));
    } else {
        console.error(chalk.red(`- یک خطای ناشناخته رخ داد.`));
    }
  }
}

