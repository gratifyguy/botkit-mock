const AxiosMockAdapter = require('axios-mock-adapter');
const {defaultSlackEndpoints} = require('./api');

class Logger {
    logData(url, data) {
        if (Array.isArray(this[url])) {
            this[url].push(data);
        } else {
            this[url] = [data];
        }
    };
}

/**
 * Bind mock api to botkit controller.
 * @param controller {Botkit}
 */
module.exports.bindMockApi = function (controller) {
    const axios = require('axios');
    const axiosMockAdapter = new AxiosMockAdapter(axios);
    const originAxiosAdapter = axios.defaults.adapter;

    const apiLogByKey = new Logger();
    const httpBodyLog = [];

	/*
	* workaround to prevent fail for slack api initialization
	* https://github.com/howdyai/botkit/blob/v4.6.1/packages/botbuilder-adapter-slack/src/slack_adapter.ts#L128-L137
	* */
	const originProcessExit = process.exit;
	process.exit = function (exitCode) {
		if (exitCode !== 1) {
			originProcessExit(exitCode)
		}
	};

	const originConsoleError = console.error;
	console.error = function (...params) {
		if (params[0].code !== 'slack_webapi_platform_error') {
			originConsoleError(...params);
		}
	};

	/*
	* monkey patch of axios mock adapter
	* axios mock does not return request and headers objects for response
	* */
    axios.defaults.adapter = async function (...params) {
        const config = params[0];
	    let dataToLog = config.data;
        try {
	        dataToLog = JSON.parse(config.data);
        } catch(e) {}

        apiLogByKey.logData(config.url, dataToLog);

        const response = await originAxiosAdapter(...params);
        response.request = {};
        response.headers = {};
        return response;
    };

    /**
     * bind default slack api endpoints to axios mock
     */
    for (const endpointKey of Object.keys(defaultSlackEndpoints)) {
        axiosMockAdapter.onPost(`${endpointKey}`).reply(
            200,
            {
                ok: true,
                ...defaultSlackEndpoints[endpointKey]
            }
        )
    }

    controller.axiosMockAdapter = axiosMockAdapter;
    controller.apiLogByKey = apiLogByKey;
    controller.httpBodyLog = httpBodyLog;
    controller.adapter.slack.axios = axios;

    /**
     * replace bot's axios with mocked one
     */
    controller.middleware.spawn.use((bot) => {
        bot.api.axios = axios;

        bot.httpBody = function(body){
            httpBodyLog.push(body);
        };

        bot.replyInteractive = (async function (src, res) {
            if (!src.incoming_message.channelData.response_url) {
                throw Error('No response_url found in incoming message');
            } else {
                apiLogByKey.logData(src.incoming_message.channelData.response_url, this.ensureMessageFormat(res));
            }
        }).bind(bot)
    });
};

module.exports.slackAdapterMockParams = {
	clientSigningSecret: "clientSigningSecretMock",
	botToken: "botTokenMock",
	debug: true
};