// --------------------------------------------------------------------

// commands/list.ts (فایل جدید)


import axios from 'axios';
import ora from 'ora';
import chalk from 'chalk';

export async function list() {
  const spinner = ora('در حال دریافت لیست پکیج‌ها...').start();
  try {
    const response = await axios.get('https://package.unknownmsv.ir/api/packages.json');
    const packages = response.data.packages;
    
    spinner.succeed(chalk.green('لیست تمام پکیج‌های موجود:'));

    // نمایش جدولی و زیبا
    const tableData = Object.keys(packages).map(pkgName => {
      const pkg = packages[pkgName];
      return {
        'نام پکیج': chalk.blue(pkgName),
        'نسخه': pkg.latest_version,
        'توضیحات': pkg.description || '---',
      };
    });
    console.table(tableData);

  } catch (error) {
    spinner.fail(chalk.red('❌ خطا در دریافت لیست پکیج‌ها.'));
  }
}
