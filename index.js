const { setupMSVCDevCmd } = require('./lib')
const core = require('@actions/core')
const axios = require("axios")

async function validateSubscription() {
  const API_URL = `https://agent.api.stepsecurity.io/v1/github/${process.env.GITHUB_REPOSITORY}/actions/subscription`

  try {
    await axios.get(API_URL, {timeout: 3000})
  } catch (error) {
    if (error.response && error.response.status === 403) {
      core.error(
        'Subscription is not valid. Reach out to support@stepsecurity.io'
      )
      process.exit(1)
    } else {
      core.info('Timeout or API not reachable. Continuing to next step.')
    }
  }
}

function main() {
    var   arch    = core.getInput('arch')
    const sdk     = core.getInput('sdk')
    const toolset = core.getInput('toolset')
    const uwp     = core.getInput('uwp')
    const spectre = core.getInput('spectre')
    const vsversion = core.getInput('vsversion')

    setupMSVCDevCmd(arch, sdk, toolset, uwp, spectre, vsversion)
}

(async () => {
    try {
        await validateSubscription();
        main()
    }
    catch (e) {
        core.setFailed('Could not setup Developer Command Prompt: ' + e.message)
    }
})()
