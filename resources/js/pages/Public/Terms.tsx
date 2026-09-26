import LegalPageLayout from '@/components/site/LegalPageLayout';

export default function Terms() {
    return (
        <LegalPageLayout
            metaTitle="Terms & Conditions | Smart Move Education Group"
            heading="Terms & Conditions"
            lastUpdated="26 September 2026"
            intro={
                <p>
                    These Terms &amp; Conditions (&ldquo;Terms&rdquo;) govern
                    your use of the Smart Move Education Group website and the
                    services we provide. By accessing our website or engaging
                    our services, you agree to be bound by these Terms. If you
                    do not agree with any part of these Terms, please do not use
                    our website or services.
                </p>
            }
            sections={[
                {
                    heading: '1. Who We Are',
                    body: (
                        <p>
                            Smart Move Education Group (&ldquo;Smart
                            Move&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or
                            &ldquo;our&rdquo;) is a UK-based student recruitment
                            and education consultancy, registered in England
                            &amp; Wales (company number 12345678), with our
                            principal office at 1st Floor, Botanical Works, 2
                            Jubilee Street, London, E1 3FU.
                        </p>
                    ),
                },
                {
                    heading: '2. Our Services',
                    body: (
                        <>
                            <p>
                                We provide free educational consultancy and
                                guidance to prospective students, including
                                course and university selection, document
                                preparation, eligibility assessment, application
                                support, and related services (the
                                &ldquo;Services&rdquo;).
                            </p>
                            <p>
                                We act as an intermediary between you and
                                partner universities and institutions. We do not
                                guarantee admission, scholarship, visa approval,
                                or any other outcome, as final decisions rest
                                solely with the relevant university,
                                institution, or government authority.
                            </p>
                        </>
                    ),
                },
                {
                    heading: '3. Use of Our Website',
                    body: (
                        <>
                            <p>
                                You agree to use our website only for lawful
                                purposes. You must not:
                            </p>
                            <ul className="list-disc space-y-2 pl-5">
                                <li>
                                    Use the website in any way that breaches
                                    applicable local, national, or international
                                    law or regulation.
                                </li>
                                <li>
                                    Attempt to gain unauthorised access to our
                                    website, servers, or any systems connected
                                    to them.
                                </li>
                                <li>
                                    Submit false, misleading, or fraudulent
                                    information through any form on our website.
                                </li>
                                <li>
                                    Use any automated system to extract data
                                    from our website without our prior written
                                    consent.
                                </li>
                            </ul>
                        </>
                    ),
                },
                {
                    heading: '4. Applications and Accuracy of Information',
                    body: (
                        <p>
                            When you submit an enquiry or application through
                            our website, you confirm that all information
                            provided is accurate, current, and complete. We rely
                            on the information you provide to advise you and to
                            process applications on your behalf, and we accept
                            no responsibility for delays, rejections, or adverse
                            outcomes arising from inaccurate or incomplete
                            information supplied by you.
                        </p>
                    ),
                },
                {
                    heading: '5. Intellectual Property',
                    body: (
                        <p>
                            All content on this website, including text,
                            graphics, logos, images, and software, is the
                            property of Smart Move Education Group or our
                            licensors and is protected by UK and international
                            copyright and trademark laws. You may view and print
                            content for your own personal, non-commercial use,
                            but you must not reproduce, distribute, or otherwise
                            commercially exploit any content without our prior
                            written permission.
                        </p>
                    ),
                },
                {
                    heading: '6. Third-Party Links and Partners',
                    body: (
                        <p>
                            Our website may contain links to third-party
                            websites, including partner universities and
                            institutions. We are not responsible for the
                            content, accuracy, or practices of any third-party
                            websites, and inclusion of a link does not imply
                            endorsement. Your use of any third-party website is
                            subject to that website&rsquo;s own terms and
                            privacy policy.
                        </p>
                    ),
                },
                {
                    heading: '7. Limitation of Liability',
                    body: (
                        <p>
                            To the fullest extent permitted by law, Smart Move
                            Education Group shall not be liable for any
                            indirect, incidental, or consequential loss arising
                            from your use of our website or Services, including
                            loss of opportunity, loss of a place at a
                            university, or visa refusal. Nothing in these Terms
                            excludes or limits our liability for death or
                            personal injury caused by our negligence, fraud, or
                            any other liability which cannot be excluded or
                            limited under English law.
                        </p>
                    ),
                },
                {
                    heading: '8. Changes to These Terms',
                    body: (
                        <p>
                            We may revise these Terms from time to time. The
                            updated Terms will apply from the date they are
                            posted on this page, and your continued use of our
                            website or Services after any changes constitutes
                            your acceptance of the revised Terms.
                        </p>
                    ),
                },
                {
                    heading: '9. Governing Law',
                    body: (
                        <p>
                            These Terms are governed by and construed in
                            accordance with the laws of England and Wales. Any
                            disputes arising out of or in connection with these
                            Terms shall be subject to the exclusive jurisdiction
                            of the courts of England and Wales.
                        </p>
                    ),
                },
                {
                    heading: '10. Contact Us',
                    body: (
                        <p>
                            If you have any questions about these Terms, please
                            contact us at{' '}
                            <a
                                href="mailto:info@smartmove-eg.com"
                                className="text-secondary-container hover:underline"
                            >
                                info@smartmove-eg.com
                            </a>{' '}
                            or call{' '}
                            <a
                                href="tel:02077909233"
                                className="text-secondary-container hover:underline"
                            >
                                020 7790 9233
                            </a>
                            .
                        </p>
                    ),
                },
            ]}
        />
    );
}
