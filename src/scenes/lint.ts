import chalk from 'chalk';
import ora from 'ora';
import { Core } from '../core';
import { NextScene } from '../types';
import { unique } from '../util/array';
import { notEmpty } from '../util/type-check';

/**
 * Run the scene to lint.
 */
export async function lint(core: Core): Promise<NextScene> {
  const lintingSpinner = ora('Linting...').start();
  const results = await core.lint();
  const ruleIdsInResults = unique(
    results
      .flatMap((result) => result.messages)
      .flatMap((message) => message.ruleId)
      .filter(notEmpty),
  );

  if (ruleIdsInResults.length === 0) {
    lintingSpinner.succeed(chalk.bold('No error found.'));
    return { name: 'exit' };
  }
  lintingSpinner.succeed(chalk.bold('Found errors.'));
  console.log();
  core.printSummaryOfResults(results);

  const hasESLintCoreProblems = results.flatMap((result) => result.messages).some((message) => message.ruleId === null);
  if (hasESLintCoreProblems) {
    console.log(chalk.bold.redBright('\n>>>>>>>>>> WARNING START'));
    console.log(chalk.bold('🚨🚨🚨 Problems generated by ESLint core are found! 🚨🚨🚨'));
    console.log(
      chalk.bold(
        'The problems cannot be fixed by eslint-interactive. Check the details of the problems below and fix them.\n',
      ),
    );
    await core.printDetailsOfResults(results, [null], 'withoutPager');
    console.log(chalk.bold.redBright('<<<<<<<<<< WARNING END\n'));
  }
  return { name: 'selectRuleIds', args: { results, ruleIdsInResults } };
}
