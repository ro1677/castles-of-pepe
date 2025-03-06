// 📌 서버에서 원화 결제를 처리하는 API 라우트
export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ success: false, message: "Method Not Allowed" });
    }

    try {
        const { email, amount } = req.body;

        if (!email || !amount) {
            return res.status(400).json({ success: false, message: "이메일과 결제 금액이 필요합니다." });
        }

        // ✅ 여기에 Toss Payments 또는 PG사 API 연동 (예제)
        console.log(`💳 ${email}님이 ${amount}원 결제 요청`);
        
        // 📌 여기서는 테스트용으로 결제 성공 처리
        return res.status(200).json({ success: true, message: "결제 성공!" });
    } catch (error) {
        console.error("🚨 결제 처리 중 오류:", error);
        return res.status(500).json({ success: false, message: "서버 오류 발생!" });
    }
}

