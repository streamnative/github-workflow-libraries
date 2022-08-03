const { t } = require('../../i18n');
const { postToSlack } = require('../../fetchers');
const buildSlackMessage = require('./buildSlackMessage');

module.exports = async ({
  org,
  repos,
  core,
  slack,
  isSponsor,
  reviewers,
  periodLength,
  disableLinks,
  displayCharts,
  pullRequest = null,
}) => {
  const { webhook, channel } = slack || {};

  if (!webhook || !channel) {
    core.debug('Slack integration is disabled. No webhook or channel configured.');
    return;
  }

  if (!isSponsor) {
    core.error('Slack integration is a premium feature, available to sponsors.');
    return;
  }

  const message = buildSlackMessage({
    org,
    repos,
    reviewers,
    pullRequest,
    periodLength,
    disableLinks,
    displayCharts,
  });

  const params = {
    webhook,
    channel,
    message,
    iconUrl: t('table.icon'),
    username: t('table.title'),
  };
  core.debug(`Post a Slack message with params: ${JSON.stringify(params, null, 2)}`);

  await postToSlack(params).catch((error) => {
    core.error(`Error posting Slack message: ${error}`);
    throw error;
  });

  core.debug('Successfully posted to slack');
};
