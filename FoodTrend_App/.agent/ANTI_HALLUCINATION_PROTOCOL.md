# Anti-Hallucination Protocol

**Problem:** AI (including Gemini/ChatGPT) can invent files, functions, or solutions that don't exist.  
**Solution:** Force verification at every step.

---

## 🛡️ The 5 Verification Gates

### Gate 1: FILE EXISTENCE CHECK (Before AI suggests changes)

**Rule:** AI must PROVE it saw the file before editing it.

**In Gemini prompts, enforce:**
```
MANDATORY: List exact lines you read from [filename]
- Line 15: [actual content]
- Line 47: [actual content]

If you cannot paste actual lines, you MUST say:
"NO ACCESS - requesting file: [filename] lines [X-Y]"
```

**Why:** Prevents AI from inventing file contents.

---

### Gate 2: PATCH VERIFICATION (Before applying AI suggestions)

**Rule:** Every AI patch must include EXACT target content from the file.

**Format enforcement:**
```
--- FILE: path/to/file.ext ---
ACTION: REPLACE
TARGET CONTENT (lines 20-25):
[Paste EXACT current code being replaced]

REPLACEMENT:
[New code]

VERIFICATION:
After this change, line 22 should read: [exact expected line]
```

**Why:** You can verify the target exists BEFORE applying the patch.

---

### Gate 3: INCREMENTAL EXECUTION (Never big-bang changes)

**Rule:** Fibonacci-sized changes only.

| Fib Level | Max Changes Per Session | Max Files Touched |
|-----------|------------------------|-------------------|
| Fib(1-2) | 1-2 small edits | 1 file |
| Fib(3) | 3-5 edits | 2-3 files |
| Fib(5) | 5-8 edits | 3-5 files |
| Fib(8) | Never exceed this | 5-8 files max |

**Why:** Small changes are easy to verify and easy to roll back.

---

### Gate 4: HUMAN VERIFICATION POINTS

**Rule:** YOU verify, not the AI.

**Mandatory checks after EVERY AI-suggested change:**
```
☐ Does the file actually exist? (dir [filename])
☐ Does the target content exist? (search in file)
☐ Did the change work? (run the app/test)
☐ Zero new errors? (check console/logs)
```

**If any ☐ = NO → Rollback immediately**

---

### Gate 5: PROOF OF WORK

**Rule:** AI must predict EXACTLY what will happen.

**Add to GEMINI prompts:**
```
MANDATORY PREDICTION:
After applying these changes:
- File [X] line [Y] will contain: [exact text]
- Running [command] will output: [exact expected output]
- Browser console will show: [exact expected state]

If prediction is wrong, patches are INVALID.
```

**Why:** AI can't hallucinate if it must predict exact outcomes.

---

## 🔬 Hallucination Detection Patterns

### Red Flags (AI is probably hallucinating):

❌ **Vague references:** "the authentication function" (which one? where?)  
❌ **Invented APIs:** "use the built-in validateUser()" (doesn't exist)  
❌ **Missing line numbers:** "add this to the file" (WHERE in the file?)  
❌ **Assumed context:** "update the config" (which config file?)  
❌ **Generic solutions:** "just add error handling" (HOW? WHERE?)

### Green Flags (AI is grounded in reality):

✅ **Exact references:** "File: auth.js, Line 47: `function login(email)...`"  
✅ **Quoted content:** Shows you the EXACT line it's modifying  
✅ **Line ranges:** "Lines 20-25 in styles.css contain..."  
✅ **Verification steps:** "After this, run X and expect Y"  
✅ **Specific paths:** Full absolute paths, not "the main file"

---

## 🚨 Emergency De-Hallucination Procedure

**If AI gives you something that seems wrong:**

```
Step 1: STOP. Do NOT apply the change.

Step 2: Ask AI to PROVE it:
"Show me the exact lines from [file] that you're referring to."

Step 3: If AI can't show exact lines:
"You don't have access to this file. 
Please request: [filename] lines [X-Y]
Then I'll paste them for you."

Step 4: Verify yourself:
- Open the file
- Search for the target content
- If NOT found → AI hallucinated

Step 5: Correct the AI:
Paste the ACTUAL file contents
Ask AI to revise based on REAL data
```

---

## 📋 Checklist: Is This AI Response Safe?

```
Before trusting ANY AI suggestion:

☐ Does it reference EXACT line numbers?
☐ Does it paste actual file content as proof?
☐ Are the file paths ABSOLUTE and COMPLETE?
☐ Did it predict exact outcomes?
☐ Is the change SMALL (Fibonacci-sized)?
☐ Can I verify each claim independently?

If ANY = NO → Request clarification before proceeding
```

---

## 🎯 Apply to Gemini Prompts

**Add this section to GEMINI_REFINEMENT_PROMPT.md and GEMINI_DAILY_DRIVER.md:**

```markdown
## ANTI-HALLUCINATION ENFORCEMENT

You MUST:
1. Paste exact lines you read (with line numbers)
2. Never invent functions/files that you haven't seen
3. If no file access: Say "NO ACCESS" and request specific lines
4. For every patch: Include exact TARGET content to replace
5. Predict exact outcomes (file contents, console output, test results)

If you cannot verify something, say:
"CANNOT VERIFY - requesting: [exactly what you need to see]"

Hallucinations = INVALID RESPONSE. Restart.
```

---

## 💡 Human Override Protocol

**Sometimes AI is right but you can't verify:**

**Example:** AI suggests a standard library function you don't recognize.

**Instead of guessing:**
```
1. Google it: "[function name] [language] documentation"
2. Check official docs
3. Test in isolation first
4. THEN apply to your code
```

**Never trust. Always verify.**

---

## 🔄 Build This Into Your Ritual

**Daily Ritual Update:**

**Morning (add 30 seconds):**
```
☐ Review yesterday's AI suggestions
☐ Did they work as predicted?
☐ Document any hallucinations in .agent/troubleshooting.md
```

**While Coding:**
```
☐ AI suggests something → verify existence FIRST
☐ Patch provided → check TARGET content exists
☐ After applying → test immediately
```

**Evening (add 30 seconds):**
```
☐ Log any hallucinations to .agent/errors/ai-hallucination/
☐ Update prompts if pattern detected
```

---

## 📊 Hallucination Tracking

**Create:** `.agent/errors/ai-hallucination/YYYY-MM-DD_description.md`

**Template:**
```markdown
# AI Hallucination

**Date:** YYYY-MM-DD  
**AI Used:** Gemini / ChatGPT / Other  
**Context:** [What you were trying to do]

## What AI Claimed
[Paste the hallucinated suggestion]

## Reality
[What actually exists/doesn't exist]

## Root Cause
- [ ] AI didn't have file access
- [ ] AI assumed standard library
- [ ] AI confused similar functions
- [ ] AI invented solution
- [ ] Other: ___

## Prevention
[How to update prompts to prevent this]

## Verification Added
[What check you added to catch this in future]
```

---

## 🎓 Philosophy

> **"In AI we trust, but we verify. Always."**

AI is a brilliant assistant but a terrible oracle.

Use it for:
✅ Suggestions  
✅ Alternatives  
✅ Pattern recognition  
✅ Boilerplate generation

Never for:
❌ Source of truth  
❌ Blind execution  
❌ Unverified facts  
❌ "Trust me, this will work"

**The Fibonacci principle applies to AI trust too:**
- Fib(1): Verify everything
- Fib(2): Trust but verify
- Fib(3): Automate verification
- Fib(5): AI + human = perfect team

---

## 🚀 Integration

This protocol is NOW MANDATORY for:
- All Gemini/ChatGPT interactions
- All code from external sources
- All "helpful suggestions" from anyone
- All Stack Overflow copy-paste

**Add to HOW_TO_USE.md checklist:**
```
When using AI help:
☐ Enforce Anti-Hallucination Protocol
☐ Verify file existence
☐ Check target content
☐ Test incrementally
☐ Document hallucinations
```

**The system protects you. Use it.** 🛡️
