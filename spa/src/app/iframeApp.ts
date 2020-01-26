import {ConfigurationLoader} from '../configuration/configurationLoader';
import {ErrorCodes} from '../plumbing/errors/errorCodes';
import {ErrorHandler} from '../plumbing/errors/errorHandler';
import {ErrorReporter} from '../plumbing/errors/errorReporter';
import {TokenRenewalResponseHandler} from '../plumbing/oauth/tokenRenewalResponseHandler';

/*
 * A mini application for the hidden iframe that does silent token renewal
 */
export class IFrameApp {

    public async execute(): Promise<void> {

        try {

            // Download configuration
            const configuration = await ConfigurationLoader.download('spa.config.json');

            // Handle token renewal responses on an iframe when using Okta
            // Note that with Cognito we use refresh tokens instead
            const handler = new TokenRenewalResponseHandler(configuration.oauth);
            await handler.handleSilentTokenRenewalResponse();

        } catch (e) {

            // In the event of errors, avoid impacting end users and output the error to the console
            const error = ErrorHandler.getFromOAuthResponse(e, ErrorCodes.tokenRenewalIframeError);
            const reporter = new ErrorReporter();
            reporter.outputToConsole(error);
        }
    }
}