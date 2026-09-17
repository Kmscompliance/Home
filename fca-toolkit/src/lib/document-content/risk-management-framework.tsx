import { ph } from "./types";
import type { DocumentBody } from "./types";

const FIRM = () =>
  ph(
    "FIRM NAME",
    "Insert your firm's full legal name, exactly as registered with Companies House and used on your FCA application."
  );

export const riskManagementFramework: DocumentBody = {
  slug: "risk-management-framework",
  summary:
    "Sets out how your firm identifies, assesses, manages, monitors and reports on the risks it faces — a core part of a full FCA authorisation application.",
  regulatoryFlags: [
    "The review cadence (\"at least annually\") is general good practice, not a fixed FCA rule — confirm this still fits before publishing if your firm's risk profile suggests more frequent review.",
  ],
  sections: [
    {
      id: "introduction",
      heading: "1. Introduction",
      blocks: [
        {
          type: "p",
          parts: [
            "This Risk Management Framework (\"RMF\") outlines ",
            FIRM(),
            "'s approach to identifying, assessing, monitoring, and mitigating risks associated with carrying out ",
            ph(
              "INSERT REGULATED ACTIVITIES",
              "List the specific regulated activities covered by your FCA authorisation (e.g. as they'll appear on the Financial Services Register)."
            ),
            " under its authorisation from the Financial Conduct Authority (FCA). This framework is designed to ensure that ",
            FIRM(),
            " maintains effective risk management practices to protect the interests of its clients, investors, and stakeholders, while also fulfilling its regulatory obligations.",
          ],
        },
      ],
    },
    {
      id: "objectives",
      heading: "2. Objectives",
      blocks: [
        {
          type: "p",
          parts: ["The primary objectives of ", FIRM(), "'s Risk Management Framework are:"],
        },
        {
          type: "ul",
          items: [
            ["To identify and assess potential risks inherent in the firm's business activities."],
            ["To implement appropriate controls and measures to mitigate identified risks."],
            [
              "To monitor and review risks on an ongoing basis to ensure their effectiveness and to adapt to changes in the operating environment.",
            ],
            ["To maintain compliance with FCA regulations and other relevant legal and regulatory requirements."],
          ],
        },
      ],
    },
    {
      id: "policies",
      heading: "3. Risk Management Policies",
      blocks: [
        {
          type: "p",
          parts: [
            "a. Risk Identification: ",
            FIRM(),
            " will employ a proactive approach to identify and assess risks across all aspects of its operations. This will involve regular risk assessments, scenario analysis, and input from relevant stakeholders. Risks will be categorised based on their nature, including operational, financial, compliance, strategic, and reputational risks.",
          ],
        },
        {
          type: "p",
          parts: [
            "b. Risk Assessment: Identified risks will be assessed for their potential impact and likelihood of occurrence. This assessment will consider both quantitative and qualitative factors, including financial exposure, regulatory implications, business continuity, and reputational damage. Risks will be assessed against ",
            FIRM(),
            "'s risk appetite: ",
            ph(
              "INSERT SUMMARY OF YOUR FIRM'S RISK APPETITE",
              "Briefly describe how much risk your firm is willing to accept in different areas — e.g. \"low tolerance for compliance and financial crime risk, moderate tolerance for operational risk.\" This should reflect a real discussion with your senior management, not just a generic statement."
            ),
            ". Risk assessments will be documented and regularly reviewed to reflect changes in the business environment.",
          ],
        },
        {
          type: "p",
          parts: [
            "c. Risk Mitigation: ",
            FIRM(),
            " will implement appropriate controls and measures to mitigate identified risks to an acceptable level. This may include internal controls, policies and procedures, training programmes, and insurance coverage. Mitigation strategies will be tailored to address specific risks and will be regularly reviewed and updated as necessary.",
          ],
        },
        {
          type: "p",
          parts: [
            "d. Risk Monitoring: Ongoing monitoring of risks will be conducted to ensure that controls remain effective and that new risks are promptly identified and addressed. This will involve regular review of key risk indicators, performance metrics, incident reports, and external developments that may impact the firm's risk profile. Monitoring activities will be integrated into day-to-day operations and will involve collaboration among relevant departments and stakeholders.",
          ],
        },
        {
          type: "p",
          parts: [
            "e. Risk Reporting: ",
            FIRM(),
            " will establish a robust risk reporting framework to communicate key risk information to relevant stakeholders and regulatory authorities. Reports will provide a comprehensive overview of the firm's risk profile, including identified risks, assessment findings, mitigation efforts, and emerging trends. Reporting will be timely, accurate, and tailored to the needs of the intended audience.",
          ],
        },
      ],
    },
    {
      id: "responsibilities",
      heading: "4. Responsibilities",
      blocks: [
        {
          type: "p",
          parts: [
            "a. ",
            ph(
              "NAME AND SMF ROLE RESPONSIBLE FOR RISK",
              "Insert the name and Senior Management Function of the person accountable for risk management at your firm (e.g. \"Jane Smith, SMF3 Executive Director\"). This should match your SMF Statement of Responsibilities."
            ),
            ": will oversee ",
            FIRM(),
            "'s risk management activities and ensure that appropriate policies, procedures, and controls are in place to manage risks effectively. This person will provide regular updates on the firm's risk profile and will provide strategic guidance on risk-related matters.",
          ],
        },
        {
          type: "p",
          parts: [
            "b. Employees: All employees of ",
            FIRM(),
            " will be responsible for identifying, reporting, and managing risks within their respective roles as and when those roles become live. Employees will receive training on risk management principles and procedures and will be encouraged to actively participate in the firm's risk management efforts.",
          ],
        },
      ],
    },
    {
      id: "review",
      heading: "5. Review and Evaluation",
      blocks: [
        {
          type: "p",
          parts: [
            "This Risk Management Framework will be subject to regular review and evaluation to ensure its continued effectiveness and relevance. Reviews will be conducted at least annually, or as required by changes in the firm's operating environment, regulatory requirements, or risk profile. Feedback from internal and external stakeholders will be sought to inform improvements to the framework.",
          ],
        },
      ],
    },
    {
      id: "conclusion",
      heading: "6. Conclusion",
      blocks: [
        {
          type: "p",
          parts: [
            FIRM(),
            " is committed to maintaining a robust Risk Management Framework to safeguard its business operations, protect the interests of its clients and stakeholders, and ensure compliance with regulatory requirements. By adhering to the principles outlined in this framework, ",
            FIRM(),
            " will be better positioned to identify, assess, monitor, and mitigate risks effectively, thereby enhancing its overall resilience and sustainability in the financial services industry.",
          ],
        },
      ],
    },
  ],
};
