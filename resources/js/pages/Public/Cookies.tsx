import LegalPageLayout from '@/components/site/LegalPageLayout';

export default function Cookies() {
    return (
        <LegalPageLayout
            metaTitle="Cookie Policy | Smart Move Education Group"
            heading="Cookie Policy"
            lastUpdated="26 September 2026"
            intro={
                <p>
                    This Cookie Policy explains how Smart Move Education Group
                    (&ldquo;Smart Move&rdquo;, &ldquo;we&rdquo;,
                    &ldquo;us&rdquo;, or &ldquo;our&rdquo;) uses cookies and
                    similar technologies on our website, in accordance with the
                    Privacy and Electronic Communications Regulations (PECR) and
                    the UK GDPR.
                </p>
            }
            sections={[
                {
                    heading: '1. What Are Cookies?',
                    body: (
                        <p>
                            Cookies are small text files placed on your device
                            when you visit a website. They are widely used to
                            make websites work, or work more efficiently, as
                            well as to provide information to the owners of the
                            site.
                        </p>
                    ),
                },
                {
                    heading: '2. Strictly Necessary Cookies',
                    body: (
                        <>
                            <p>
                                These cookies are essential for our website to
                                function correctly and cannot be switched off.
                                They are usually set only in response to actions
                                you take, such as logging in or filling in a
                                form, and include:
                            </p>
                            <ul className="list-disc space-y-2 pl-5">
                                <li>
                                    Session cookies that keep you securely
                                    signed in while using our dashboard.
                                </li>
                                <li>
                                    CSRF protection cookies (XSRF-TOKEN) that
                                    safeguard forms on our website against
                                    cross-site request forgery.
                                </li>
                                <li>
                                    &ldquo;Remember me&rdquo; cookies, used only
                                    if you choose to stay signed in between
                                    visits.
                                </li>
                            </ul>
                        </>
                    ),
                },
                {
                    heading: '3. Functional Cookies',
                    body: (
                        <>
                            <p>
                                These cookies allow us to remember choices you
                                make and provide enhanced, personalised
                                features, such as:
                            </p>
                            <ul className="list-disc space-y-2 pl-5">
                                <li>
                                    Remembering your appearance preference
                                    (light, dark, or system theme).
                                </li>
                                <li>
                                    Remembering the state of navigation panels
                                    within our admin dashboard.
                                </li>
                            </ul>
                        </>
                    ),
                },
                {
                    heading: '4. Third-Party and Analytics Cookies',
                    body: (
                        <p>
                            We do not currently use third-party advertising or
                            analytics cookies on our website. If we introduce
                            tools such as analytics, social media, or marketing
                            cookies in the future, we will update this policy
                            and, where required by law, request your consent
                            before they are set.
                        </p>
                    ),
                },
                {
                    heading: '5. Managing Cookies',
                    body: (
                        <>
                            <p>
                                Most web browsers allow you to control cookies
                                through their settings. You can usually find
                                these settings in the &ldquo;Options&rdquo;,
                                &ldquo;Preferences&rdquo;, or
                                &ldquo;Privacy&rdquo; menu of your browser.
                                Please note that blocking strictly necessary
                                cookies may affect the functionality of our
                                website, such as staying signed in to the
                                dashboard.
                            </p>
                            <p>
                                For more information on managing or deleting
                                cookies, visit{' '}
                                <a
                                    href="https://www.aboutcookies.org"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-secondary-container hover:underline"
                                >
                                    aboutcookies.org
                                </a>
                                .
                            </p>
                        </>
                    ),
                },
                {
                    heading: '6. Changes to This Policy',
                    body: (
                        <p>
                            We may update this Cookie Policy from time to time
                            to reflect changes in the cookies we use or for
                            other operational, legal, or regulatory reasons. Any
                            updates will be posted on this page with a revised
                            &ldquo;last updated&rdquo; date.
                        </p>
                    ),
                },
                {
                    heading: '7. Contact Us',
                    body: (
                        <p>
                            If you have any questions about our use of cookies,
                            please contact us at{' '}
                            <a
                                href="mailto:info@smartmove-eg.com"
                                className="text-secondary-container hover:underline"
                            >
                                info@smartmove-eg.com
                            </a>
                            . For details on how we handle your personal data
                            more broadly, please see our{' '}
                            <a
                                href="/privacy-policy"
                                className="text-secondary-container hover:underline"
                            >
                                Privacy Policy
                            </a>
                            .
                        </p>
                    ),
                },
            ]}
        />
    );
}
