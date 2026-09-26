import LegalPageLayout from '@/components/site/LegalPageLayout';

export default function PrivacyPolicy() {
    return (
        <LegalPageLayout
            metaTitle="Privacy Policy | Smart Move Education Group"
            heading="Privacy Policy"
            lastUpdated="26 September 2026"
            intro={
                <p>
                    Smart Move Education Group (&ldquo;Smart Move&rdquo;,
                    &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is
                    committed to protecting and respecting your privacy. This
                    policy explains how we collect, use, store, and protect your
                    personal data when you use our website, apply for our
                    services, or otherwise interact with us, in accordance with
                    the UK General Data Protection Regulation (UK GDPR) and the
                    Data Protection Act 2018.
                </p>
            }
            sections={[
                {
                    heading: '1. Who We Are',
                    body: (
                        <>
                            <p>
                                Smart Move Education Group is a UK-based student
                                recruitment and education consultancy,
                                registered in England &amp; Wales (company
                                number 12345678), with our principal office at
                                1st Floor, Botanical Works, 2 Jubilee Street,
                                London, E1 3FU. We are the data controller
                                responsible for your personal data.
                            </p>
                            <p>
                                If you have any questions about this policy or
                                how we handle your data, you can contact us at{' '}
                                <a
                                    href="mailto:info@smartmove-eg.com"
                                    className="text-secondary-container hover:underline"
                                >
                                    info@smartmove-eg.com
                                </a>{' '}
                                or by phone on{' '}
                                <a
                                    href="tel:02077909233"
                                    className="text-secondary-container hover:underline"
                                >
                                    020 7790 9233
                                </a>
                                .
                            </p>
                        </>
                    ),
                },
                {
                    heading: '2. Information We Collect',
                    body: (
                        <>
                            <p>
                                We may collect and process the following
                                categories of personal data:
                            </p>
                            <ul className="list-disc space-y-2 pl-5">
                                <li>
                                    <span className="text-white">
                                        Identity and contact data:
                                    </span>{' '}
                                    name, date of birth, nationality, email
                                    address, postal address, and telephone
                                    number.
                                </li>
                                <li>
                                    <span className="text-white">
                                        Application data:
                                    </span>{' '}
                                    academic qualifications, transcripts,
                                    personal statements, references, English
                                    language test results, passport or visa
                                    details, and other documents submitted as
                                    part of a course, university, or event
                                    application.
                                </li>
                                <li>
                                    <span className="text-white">
                                        Enquiry data:
                                    </span>{' '}
                                    details you provide through our contact
                                    forms, agent enquiry forms, newsletter
                                    sign-up, or event registrations.
                                </li>
                                <li>
                                    <span className="text-white">
                                        Technical data:
                                    </span>{' '}
                                    IP address, browser type and version, device
                                    information, and pages visited on our
                                    website, collected via cookies and similar
                                    technologies (see our{' '}
                                    <a
                                        href="/cookies"
                                        className="text-secondary-container hover:underline"
                                    >
                                        Cookie Policy
                                    </a>
                                    ).
                                </li>
                                <li>
                                    <span className="text-white">
                                        Communications data:
                                    </span>{' '}
                                    records of correspondence if you contact us
                                    by email, phone, or through the website.
                                </li>
                            </ul>
                        </>
                    ),
                },
                {
                    heading: '3. How We Use Your Information',
                    body: (
                        <>
                            <p>
                                We only use your personal data where we have a
                                lawful basis to do so under UK GDPR, including
                                to:
                            </p>
                            <ul className="list-disc space-y-2 pl-5">
                                <li>
                                    Provide free consultation, course guidance,
                                    and application support (performance of a
                                    contract or steps taken at your request).
                                </li>
                                <li>
                                    Submit and manage applications on your
                                    behalf to partner universities and
                                    institutions (performance of a contract).
                                </li>
                                <li>
                                    Respond to enquiries submitted through our
                                    contact, agent, or event registration forms
                                    (legitimate interests).
                                </li>
                                <li>
                                    Send newsletters and marketing updates where
                                    you have opted in (consent, which you may
                                    withdraw at any time).
                                </li>
                                <li>
                                    Comply with legal and regulatory
                                    obligations, including those relating to
                                    immigration and education compliance.
                                </li>
                                <li>
                                    Maintain the security and proper functioning
                                    of our website and systems (legitimate
                                    interests).
                                </li>
                            </ul>
                        </>
                    ),
                },
                {
                    heading: '4. Sharing Your Information',
                    body: (
                        <>
                            <p>We may share your personal data with:</p>
                            <ul className="list-disc space-y-2 pl-5">
                                <li>
                                    Partner universities, colleges, and awarding
                                    bodies to which you apply, including UCAS
                                    where relevant.
                                </li>
                                <li>
                                    Our official partner, Kampus Group, and
                                    other trusted agents involved in processing
                                    your application.
                                </li>
                                <li>
                                    IT, hosting, and email service providers who
                                    process data on our behalf under contract.
                                </li>
                                <li>
                                    Regulators or authorities where we are
                                    required to do so by law.
                                </li>
                            </ul>
                            <p>
                                We do not sell your personal data to third
                                parties. Where a third party processes data on
                                our behalf, we require them to keep your data
                                secure and use it only for the purposes we
                                specify.
                            </p>
                        </>
                    ),
                },
                {
                    heading: '5. International Transfers',
                    body: (
                        <p>
                            Some partner universities or service providers we
                            work with may be located outside the UK. Where
                            personal data is transferred internationally, we
                            ensure appropriate safeguards are in place, such as
                            adequacy decisions or standard contractual clauses
                            approved for use under UK data protection law.
                        </p>
                    ),
                },
                {
                    heading: '6. Data Retention',
                    body: (
                        <p>
                            We retain personal data only for as long as
                            necessary to fulfil the purposes we collected it
                            for, including to satisfy legal, accounting, or
                            reporting requirements. Application and enquiry
                            records are typically retained for the duration of
                            your engagement with us and for a reasonable period
                            afterwards, after which data is securely deleted or
                            anonymised.
                        </p>
                    ),
                },
                {
                    heading: '7. Your Rights',
                    body: (
                        <>
                            <p>Under UK GDPR, you have the right to:</p>
                            <ul className="list-disc space-y-2 pl-5">
                                <li>
                                    Request access to the personal data we hold
                                    about you.
                                </li>
                                <li>
                                    Request correction of inaccurate or
                                    incomplete data.
                                </li>
                                <li>
                                    Request erasure of your data, where
                                    applicable.
                                </li>
                                <li>
                                    Object to or request restriction of certain
                                    processing.
                                </li>
                                <li>
                                    Request that your data be transferred to
                                    another organisation (data portability).
                                </li>
                                <li>
                                    Withdraw consent at any time, where
                                    processing is based on consent.
                                </li>
                            </ul>
                            <p>
                                To exercise any of these rights, please contact
                                us at{' '}
                                <a
                                    href="mailto:info@smartmove-eg.com"
                                    className="text-secondary-container hover:underline"
                                >
                                    info@smartmove-eg.com
                                </a>
                                . You also have the right to lodge a complaint
                                with the Information Commissioner&rsquo;s Office
                                (ICO), the UK supervisory authority for data
                                protection, at{' '}
                                <a
                                    href="https://ico.org.uk"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-secondary-container hover:underline"
                                >
                                    ico.org.uk
                                </a>{' '}
                                or by calling 0303 123 1113.
                            </p>
                        </>
                    ),
                },
                {
                    heading: '8. Children’s Privacy',
                    body: (
                        <p>
                            Our services are intended for prospective students
                            of further and higher education who are capable of
                            giving their own consent. Where we process data
                            relating to a minor, we will only do so with the
                            consent of a parent or legal guardian where required
                            by law.
                        </p>
                    ),
                },
                {
                    heading: '9. Security',
                    body: (
                        <p>
                            We take appropriate technical and organisational
                            measures to protect your personal data against
                            unauthorised access, alteration, disclosure, or
                            destruction. Access to personal data is restricted
                            to staff and partners who need it to perform their
                            role.
                        </p>
                    ),
                },
                {
                    heading: '10. Changes to This Policy',
                    body: (
                        <p>
                            We may update this Privacy Policy from time to time
                            to reflect changes in our practices or legal
                            requirements. Any updates will be posted on this
                            page with a revised &ldquo;last updated&rdquo; date.
                        </p>
                    ),
                },
            ]}
        />
    );
}
