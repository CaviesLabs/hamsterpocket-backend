const now = new Date().toISOString().replaceAll(':', '-');
module.exports = {
  release: {
    requireModule: ['ts-node/register'],
    require: ['features/step_definitions/*.ts'],
    format: [`html:./release-reports/report_${now}.html`],
    publishQuiet: true,
    tags: 'not (@skip or @wip)',
  },
  default: {
    requireModule: ['ts-node/register'],
    require: ['features/step_definitions/*.ts'],
    // parallel: <Won't work by using ts-node>,
    publishQuiet: true,
  },
};
