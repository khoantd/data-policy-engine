# LiteLLM

**ID:** `llm`  
**Title:** LiteLLM  
**Kind:** System  
**Description:** Optional AI assist for Admin import/samples  
**Tags:** external  

---

## Purpose  
LiteLLM is an optional external language‑model service that provides AI‑powered assistance to the ROS Policy Admin UI (Admin BFF). It is used to enrich administrative workflows such as importing sample policies, generating example policy fragments, or providing quick suggestions while an administrator is editing retention or classification policies.

---

## Responsibilities  
| Responsibility | Description |
|----------------|-------------|
| **AI Assistance** | Receive masked prompts from the Admin BFF and return AI‑generated text to aid administrators. |
| **Prompt Masking** | Ensure that any sensitive data contained in the prompts is removed or obfuscated before it is sent to LiteLLM. |
| **Rate Limiting & Cost Control** | Respect the configured API limits and track usage to keep costs predictable. |
| **Response Validation** | Optionally verify that the returned text conforms to policy DSL syntax or basic quality checks. |
| **Fail‑over** | Gracefully degrade when the external LLM is unreachable or returns errors, providing a fallback message or silent failure. |

---

## Interfaces & Dependencies  
### 1. Admin BFF (ROS Policy)  
- **Outgoing:** `LiteLLM → ROS Policy · Admin BFF only (masked prompts)`  
- **Method:** `POST /api/v1/llm/assist` (example)  
- **Payload:** JSON containing a `prompt` field, where all sensitive content has been masked.  
- **Response:** JSON containing the AI’s reply in a `text` field.

### 2. External LLM Provider  
- **Protocol:** HTTPS REST API (generic to providers such as OpenAI, Anthropic, or internal LLMs).  
- **Authentication:** API key or OAuth token stored in the Admin BFF configuration.  
- **Dependencies:** Network connectivity, provider availability, and compliance with data handling policies.

---

## Constraints & Notes  

1. **Optional Integration**  
   - LiteLLM is not a core component of ROS Policy; the system functions normally without it.  

2. **External System**  
   - As an external dependency, uptime, latency, and cost are outside the control of the ROS Policy platform team.  

3. **Data Privacy**  
   - The Admin BFF must mask all personally identifiable or sensitive data before forwarding prompts to LiteLLM.  
   - No raw policy content, user data, or other sensitive information should ever be transmitted to the external LLM.  

4. **Compliance**  
   - Usage must comply with all relevant data protection regulations (e.g., GDPR, CCPA).  
   - The provider’s data processing agreement must be reviewed to ensure that masked content does not constitute personal data.  

5. **Rate Limiting**  
   - The Admin BFF should enforce per‑user or per‑tenant rate limits to avoid exceeding provider quotas and to manage cost.  

6. **Error Handling**  
   - In case of API failure, the Admin UI should display a friendly message and optionally log the event for investigation.  

7. **Versioning**  
   - The LiteLLM integration should be versioned independently of the ROS Policy core; updates to the LLM API or prompts should be tested in a staging environment before promotion.  

8. **Security**  
   - All communication with LiteLLM must occur over TLS.  
   - The API key or token should be stored securely (e.g., secret management system) and rotated regularly.  

---

**Next Steps for Platform Team**

- Verify that the Admin BFF masks prompts correctly before sending them to LiteLLM.  
- Ensure that the LLM integration is fully documented and that fallback handling is implemented.  
- Monitor usage metrics to keep costs predictable and to detect anomalous behavior.  
- Confirm that the data processing agreement with the LLM provider satisfies all regulatory obligations.
