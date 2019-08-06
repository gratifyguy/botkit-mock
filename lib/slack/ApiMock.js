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
    * monkey patch of axios mock adapter
    * axios mock does not return request and headers objects for response
    * */
    axios.defaults.adapter = async function (...params) {
        const config = params[0];
        apiLogByKey.logData(config.url, JSON.parse(config.data));

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
        }

        bot.replyInteractive = (async function (src, res) {
            if (!src.incoming_message.channelData.response_url) {
                throw Error('No response_url found in incoming message');
            } else {
                apiLogByKey.logData(src.incoming_message.channelData.response_url, this.ensureMessageFormat(res));
            }
        }).bind(bot)
    });
};