
import { GamePromptData } from '../constants';

export function determineGameType(data: GamePromptData): string {
  if (data.gameType !== "Tự động chọn kiểu game phù hợp nhất") {
    return data.gameType;
  }

  const content = (data.subject + " " + data.lessonName + " " + data.coreContent).toLowerCase();
  
  if (content.includes("từ vựng") || content.includes("ngôn ngữ") || content.includes("english") || content.includes("tiếng")) {
    return "Cửa hàng học tập";
  }
  if (content.includes("toán") || content.includes("số") || content.includes("phép tính")) {
    return "Đua xe trả lời câu hỏi";
  }
  if (content.includes("lịch sử") || content.includes("địa lý") || content.includes("chiến tranh") || content.includes("sự kiện")) {
    return "Truy tìm kho báu";
  }
  if (content.includes("quy trình") || content.includes("kỹ thuật") || content.includes("thực hành")) {
    return "Hành trình vượt ải";
  }
  if (data.dataTypes.includes("Nhiệm vụ nhóm") || data.dataTypes.includes("Nhiệm vụ nhóm")) {
    return "Bingo đồng đội";
  }
  
  return "Ai là triệu phú lớp học"; // Default
}

export function generateMainPrompt(data: GamePromptData): string {
  const selectedGameType = determineGameType(data);
  const vsModeInstruction = data.enableVsMode ? `
- CHẾ ĐỘ ĐỐI KHÁNG THỜI GIAN THỰC (DUAL PLAYERS / 1VS1 SPLIT-SCREEN):
  + Tích hợp nút chuyển đổi chế độ chơi trực quan ở Menu chính: "Chơi Đơn" (Solo Adventure) và "Đấu Đối Kháng" (1v1 Dual).
  + Ở chế độ Đối Kháng: Giao diện chia làm hai khu vực (Split-screen) hoặc bảng điều khiển riêng biệt ngay trên cùng một thiết bị. 
  + Cách phím thi đấu tốc độ:
    * Người chơi 1 (Phía trái): Sử dụng tổ hợp phím (A, S, D, F hoặc phím số cảm ứng bên trái) tương ứng với đáp án 1, 2, 3, 4.
    * Người chơi 2 (Phía phải): Sử dụng tổ hợp phím (H, J, K, L hoặc phím số cảm ứng bên phải) hoặc phím mũi tên tương ứng đáp án.
  + Cơ chế thi đấu: Cả hai người chơi cùng nhìn câu hỏi xuất hiện ở giữa màn hình. Ai nhấn đúng đáp án nhanh hơn sẽ ghi điểm, bên nhấn sai sẽ bị trừ điểm hoặc bị đóng băng trong vài giây.
  + Visual Kéo Co (Tug of War Scorebar): Thiết kế một thanh trượt động chạy biểu diễn tỉ lệ điểm số lấn áp giữa hai người chơi theo thời gian thực (với màu xanh dương đại diện Player 1 và màu đỏ/hồng đại diện Player 2).
  + Chibi Đối đầu: Vẽ hai nhân vật Chibi đại diện ở hai góc đối chiến, có động tác ăn mừng, nhảy vui sướng khi ghi điểm, hoặc mếu máo xị mặt khi nhấn sai bám đuổi kịch tính từng câu.` : '';
  
  return `Bạn là một UI/UX Designer, Game Artist và Full-stack Developer xuất sắc. Nhiệm vụ của bạn là tạo ra một trò chơi học tập (Educational Game) đỉnh cao, mang tính đột phá về cả sư phạm và thẩm mỹ bằng một file HTML duy nhất.

DỰ ÁN: ${data.lessonName.toUpperCase()}
MÔN HỌC: ${data.subject} | ĐỐI TƯỢNG: ${data.grade}

YÊU CẦU CHI TIẾT VỀ NỘI DUNG & SƯ PHẠM:
1. Mục tiêu: ${data.objectives}
2. Kiến thức cốt lõi: ${data.coreContent}
3. Cấp độ: ${data.studentLevel}
4. Ngân hàng câu hỏi: Tự soạn ít nhất ${data.questionCount} thử thách chất lượng cao, có tính phân hóa. Với các câu sai, phải có phần giải thích kiến thức (Feedback) ngắn gọn để học sinh khắc sâu bài học.

KIẾN TRÚC TRÒ CHƠI & UX (STYLE: ${selectedGameType}):
- Lối chơi: Trực quan, gây nghiện. Có Hệ thống Level, Thanh tiến trình (ProgressBar), Điểm số (Score) và Combo (thưởng thêm điểm khi làm đúng liên tiếp).
- Game Map & Parallax: Thiết kế một bản đồ hành trình (Game Map) bằng CSS/SVG với các trạm dừng (milestones) tương ứng với câu hỏi. Khi học sinh hoàn thành, nhân vật sẽ di chuyển trên bản đồ. Sử dụng hiệu ứng Parallax nhẹ nhàng khi cuộn (scroll) hoặc di chuyển để tạo chiều sâu không gian kỳ ảo.
- Biểu tượng (Icons): Sử dụng các icon vui nhộn bám sát chủ đề "${data.subject}" được vẽ bằng SVG. ${vsModeInstruction}

THẾ GIỚI CHIBI ĐỘNG (INTERACTIVE AVATAR):
- Nhân vật: Vẽ phong cách Chibi siêu dễ thương bằng Pure CSS hoặc SVG. Ở chế độ Đấu Đối Kháng 1v1, hãy nhân bản thành hai nhân vật Chibi với hai sắc màu/trang phục riêng biệt và chuyển đổi linh động.
- Biểu cảm linh hoạt (Expression System): 
  + IDLE: Nháy mắt hoặc nhún nhảy nhẹ khi chờ.
  + HAPPY: Vui sướng, bắn tim hoặc nhảy cẫng lên khi học sinh trả lời ĐÚNG.
  + SAD: Hơi xị mặt hoặc có hiệu ứng mây đen khi trả lời SAI.
  + WIN: Màn ăn mừng hoàng tráng khi hoàn thành game.

TIÊU CHUẨN DESIGN SIÊU CẤP (APPLE & GLASSMORPHISM):
- Giao diện: Glassmorphism cực kỳ lung linh. Sử dụng backdrop-filter: blur(20px), viền sáng mờ, đổ bóng lớp (layered shadows).
- Typography: Font sans-serif hiện đại, cỡ chữ to rõ cho học sinh dễ đọc trên máy chiếu.
- Animation: Sử dụng CSS Keyframes và Web Animations API để tạo sự mượt mà trong mọi chuyển động: Card flip, Button pulse, Popup spring.

TÍNH NĂNG CHUYÊN NGHIỆP & BẢNG XẾP HẠNG (ADMIN, DATA & LEADERBOARD):
- Bảng xếp hạng cục bộ (Local Leaderboard): Tích hợp tính năng lưu trữ Top 5 điểm số cao nhất của người chơi trên cùng một thiết bị thông qua localStorage.
  + Khi trò chơi kết thúc (Game Over hoặc Win), nếu điểm của học sinh lọt vào Top 5 điểm cao nhất, hiển thị màn hình chúc mừng rực rỡ và một Form nhập tên học sinh siêu dễ dễ thương.
  + Lưu điểm số cùng tên người chơi và thời gian chơi tương ứng.
  + Thiết kế màn hình xem Bảng xếp hạng (Leaderboard Screen) tuyệt đẹp với bảng liệt kê thứ hạng (Rank 1-5), có bục vinh danh (Podium) động vẽ bằng SVG/CSS cho Top 3, xếp huy chương vàng/bạc/đồng rạng rỡ.
  + Tích hợp nút Reset xóa bảng xếp hạng bí mật hoặc trong Teacher Dashboard.
- Teacher Dashboard: Tích hợp màn hình cấu hình dành riêng cho giáo viên.
- Data Management: Cho phép giáo viên Sửa/Thêm câu hỏi trực tiếp. Có tính năng Export/Import (Xuất/Nhập) ngân hàng câu hỏi qua file JSON để tái sử dụng tiện lợi.
- Lưu trữ: Sử dụng localStorage để ghi lại High Score, bảng xếp hạng và tiến trình học tập của học sinh.

YÊU CẦU KỸ THUẬT AN TOÀN TRÁNH TREO TRANG (ANTI-CRASH STANDARDS):
- Một file HTML duy nhất chứa toàn bộ CSS và JS.
- CHỐNG LỖI LOCALSTORAGE TRONG SANDBOX IFRAME: Trình duyệt trong môi trường Gemini Canvas thường chặn truy cập localStorage. Bạn BẤT BUỘC phải bọc toàn bộ code đọc/ghi localStorage trong khối "try { ... } catch (e) { ... }" và tạo một Object lưu trữ tạm thời dự phòng trên RAM (In-Memory Fallback Store) nếu localStorage ném ra ngoại lệ. Điều này giúp game khởi chạy mượt mà, tuyệt đối không bị dừng trang đột ngột hay hiện lỗi đỏ "Đã xảy ra lỗi".
- CHỐNG LỖI TOÁN HỌC / TRÌNH BÀY LATEX VỠ CHUỖI: Nếu bài học có ký hiệu Toán học (nhập môn Toán), tuyệt đối KHÔNG ĐƯỢC dùng định dạng LaTeX thô như "$\\mathbb{Z}$" hoặc dấu "$" tùy tiện bọc ký tự chữ để tránh bị lỗi hiển thị rác hoặc lỗi cú pháp JS chuỗi. Phải luôn viết bằng text Unicode trực quan, thân thiện (ví dụ: "Số nguyên Z", "Tập Z", "x thuộc Z").
- KHỞI TẠO ÂM THANH AN TOÀN CHO TRÌNH DUYỆT: Để vượt qua chính sách Autoplay bảo mật của trình duyệt, KHÔNG khởi tạo trực tiếp Web Audio API ngay khi load trang. Chỉ khởi tạo AudioContext khi học sinh nhấp chuột tương tác lần đầu tiên (ví dụ khi nhấn nút "Bắt đầu chơi", "Chọn đáp án").
- CDN CHẤT LƯỢNG CAO TRONG THẺ <head>: Được phép nhúng Tailwind CSS CDN ('<script src="https://cdn.tailwindcss.com"></script>') và Lucide Icons CDN ('<script src="https://unpkg.com/lucide@latest"></script>' - nhớ kích hoạt bằng 'lucide.createIcons()' sau khi DOM load xong) để vẽ giao diện tuyệt vời. Không dùng ảnh/âm thanh từ link bên ngoài để tránh chặn CORS/404. Toàn bộ hình ảnh, nhân vật, avatar Chibi đều phải vẽ bằng CSS/SVG trực tiếp.
- Responsive: Hiển thị mượt mà từ điện thoại đến máy chiếu thông minh.

ĐẦU RA: 
Chỉ trả về mã nguồn trong thẻ <html>. Không giải thích, không bọc trong markdown block. Bắt đầu ngay bằng <!DOCTYPE html>.`;
}

export function generateFiveIdeas(data: GamePromptData): string {
  return `Dựa trên bài học "${data.lessonName}" môn ${data.subject} cho ${data.grade}, hãy đề xuất 5 ý tưởng game học tập sáng tạo khác nhau bằng HTML/JS. 
Mỗi ý tưởng cần bao gồm: Tên game, Cách chơi ngắn gọn, và Tại sao nó phù hợp với nội dung này.`;
}

export function generateImproveUIPrompt(): string {
  return `Bạn là một UI/UX Designer chuyên nghiệp. Hãy cung cấp mã CSS và JS để nâng cấp giao diện cho game học tập sau đây trở nên cực kỳ lung linh, hiện đại theo phong cách Apple-style hoặc Glassmorphism. Tập trung vào Typography, Spacing, Animation và Micro-interactions.`;
}

export function generateChibiPrompt(): string {
  return `Hãy thêm các nhân vật phong cách Chibi dễ thương vẽ bằng CSS (SVG/Pure CSS) vào game. Các nhân vật này sẽ có biểu cảm vui mừng khi học sinh làm đúng và buồn khi làm sai. Ngoài ra, hãy trang trí map game với các icon vui nhộn bám sát chủ đề bài học.`;
}

export function generateDebuggerPrompt(): string {
  return `Tôi có đoạn code game HTML/JS đang gặp lỗi. Hãy là một Senior Developer, phân tích logic, tìm lỗi sai (bug) và cung cấp bản sửa lỗi hoàn chỉnh, tối ưu nhất.`;
}

export function generateProfessionalVersionPrompt(): string {
  return `Hãy nâng cấp trò chơi này lên phiên bản 'Professional'. Yêu cầu:
1. Thêm hệ thống Level (Dễ - Trung bình - Khó).
2. Tích hợp màn hình Admin cho giáo viên (thêm/sửa/xóa câu hỏi).
3. Hỗ trợ lưu trữ tiến trình qua localStorage.
4. Có tính năng xuất và nhập dữ liệu câu hỏi qua file JSON.
5. Giao diện được trau chuốt tỉ mỉ ở mức độ cao nhất.`;
}
