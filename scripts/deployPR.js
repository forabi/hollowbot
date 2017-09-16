const awsSdk = require('aws-sdk');
// const nodegit = require('nodegit');

/**
 * @param {Hubot.Robot} robot
 */
module.exports = robot => {
  [/test PR #?([0-9]+)$/i, /test #([0-9]+)$/i].forEach(regExp => {
    robot.respond(regExp, async res => {
      const pullRequestNumber = res.match[1];
      res.reply(pullRequestNumber);
      const eb = new awsSdk.ElasticBeanstalk();
      const s3 = new awsSdk.S3();
      const s3Res = await s3
        .upload({
          Key: 'stuff',
          // Body: zipFile,
          Bucket: 'PRs',
        })
        .promise();
      await eb
        .createApplicationVersion({
          ApplicationName: 'hollowverse',
          VersionLabel: `pr-${pullRequestNumber}`,
          SourceBundle: {
            S3Bucket: s3Res.Bucket,
            S3Key: s3Res.Key,
          },
        })
        .promise();
    });
  });
};
