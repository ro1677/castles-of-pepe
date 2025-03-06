const crypto = require("crypto");

function getInstructionIdentifier(instructionName) {
    const preimage = `global:${instructionName}`;
    const hash = crypto.createHash("sha256").update(preimage).digest();
    return hash.slice(0, 8); // 첫 8바이트 사용
}

console.log("Instruction Identifier:", getInstructionIdentifier("your_instruction_name"));

