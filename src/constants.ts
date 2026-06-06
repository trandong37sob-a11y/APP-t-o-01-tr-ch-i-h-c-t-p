
export interface GamePromptData {
  subject: string;
  grade: string;
  lessonName: string;
  coreContent: string;
  objectives: string;
  questionCount: number;
  gameType: string;
  uiStyle: string;
  studentLevel: string;
  dataTypes: string[];
  technicalRequirements: string[];
  language: string;
  teacherNotes: string;
  enableVsMode?: boolean;
}

export const GAME_TYPES = [
  "Tự động chọn kiểu game phù hợp nhất",
  "Kéo thả ghép đúng",
  "Lật thẻ quái vật",
  "Bingo đồng đội",
  "Pacman chọn đáp án",
  "Vòng quay may mắn",
  "Cửa hàng học tập",
  "Đua xe trả lời câu hỏi",
  "Mê cung kiến thức",
  "Ai là triệu phú lớp học",
  "Rung chuông vàng mini",
  "Truy tìm kho báu",
  "Ghép cặp hình ảnh và khái niệm",
  "Thoát khỏi căn phòng bí mật",
  "Hành trình vượt ải"
];

export const UI_STYLES = [
  "Hoạt hình dễ thương",
  "Pixel arcade",
  "Neon hiện đại",
  "3D vui nhộn",
  "Sách giáo khoa hiện đại",
  "Bảng lớp học",
  "Phiêu lưu khám phá",
  "Khoa học công nghệ",
  "Trung tâm thương mại",
  "Nông trại học tập",
  "Không gian vũ trụ",
  "Xưởng thực hành nghề nghiệp"
];

export const STUDENT_LEVELS = [
  "Dễ",
  "Trung bình",
  "Khó",
  "Phân hóa 3 mức"
];

export const DATA_TYPES = [
  "Câu hỏi trắc nghiệm",
  "Câu hỏi đúng sai",
  "Ghép từ với nghĩa",
  "Ghép hình với chữ",
  "Điền từ còn thiếu",
  "Sắp xếp thứ tự",
  "Tình huống thực hành",
  "Nhiệm vụ nhóm",
  "Câu hỏi có hình ảnh",
  "Câu hỏi có âm thanh"
];

export const TECH_REQUIREMENTS = [
  "Một file HTML duy nhất",
  "Chạy trực tiếp trên trình duyệt",
  "Không dùng thư viện ngoài",
  "Hỗ trợ điện thoại",
  "Hỗ trợ máy chiếu lớp học",
  "Có âm thanh bằng Web Audio API",
  "Có hiệu ứng chuyển động",
  "Có lưu dữ liệu bằng localStorage",
  "Có xuất nhập file json",
  "Có phần cài đặt cho giáo viên",
  "Có nút chơi lại"
];

export const LANGUAGES = [
  "Tiếng Việt",
  "Tiếng Anh",
  "Song ngữ Việt Anh"
];

export const QUICK_IDEAS = [
  {
    id: "ai-idea",
    name: "Ý tưởng từ Trí tuệ nhân tạo AI",
    description: "AI sẽ tự phân tích bài học và đề xuất kiểu game sáng tạo, độc đáo nhất cho bạn.",
    suitable: "⭐ Đề xuất bởi AI",
    type: "Tự động chọn kiểu game phù hợp nhất"
  },
  {
    id: "drag-drop",
    name: "Game kéo thả ghép đúng",
    description: "Ghép khái niệm, từ vựng, hình ảnh, công thức.",
    suitable: "Toán, Ngoại ngữ, Khoa học",
    type: "Kéo thả ghép đúng"
  },
  {
    id: "monster-cards",
    name: "Game lật thẻ quái vật",
    description: "Yếu tố bất ngờ, trả lời đúng nhận điểm.",
    suitable: "Mầm non, Tiểu học, Tiếng Anh",
    type: "Lật thẻ quái vật"
  },
  {
    id: "bingo",
    name: "Game Bingo đồng đội",
    description: "Hoạt động nhóm đầy kịch tính.",
    suitable: "Tất cả các môn",
    type: "Bingo đồng đội"
  },
  {
    id: "pacman",
    name: "Game Pacman chọn đáp án",
    description: "Di chuyển ăn điểm, tránh chướng ngại vật.",
    suitable: "Tin học, Toán, Ngoại ngữ",
    type: "Pacman chọn đáp án"
  },
  {
    id: "store",
    name: "Game cửa hàng học tập",
    description: "Mua sắm, tính tiền, thực hành thực tế.",
    suitable: "Toán, Kỹ năng sống, Tiếng Anh",
    type: "Cửa hàng học tập"
  },
  {
    id: "racing",
    name: "Game đua xe kiến thức",
    description: "Trả lời đúng xe sẽ chạy nhanh về đích.",
    suitable: "Toán, Vật lý, Hóa học",
    type: "Đua xe trả lời câu hỏi"
  },
  {
    id: "adventure",
    name: "Game vượt ải phiêu lưu",
    description: "Vượt qua các màn chơi đầy thử thách.",
    suitable: "Lịch sử, Địa lý, Ngữ văn",
    type: "Hành trình vượt ải"
  },
  {
    id: "treasure",
    name: "Game truy tìm kho báu",
    description: "Giải đố tìm chìa khóa mở rương.",
    suitable: "Lịch sử, Địa lý, Tin học",
    type: "Truy tìm kho báu"
  },
  {
    id: "maze",
    name: "Game mê cung kiến thức",
    description: "Tìm đường thoát bằng câu trả lời đúng.",
    suitable: "Lý, Hóa, Sinh",
    type: "Mê cung kiến thức"
  },
  {
    id: "millionaire",
    name: "Game ai là triệu phú",
    description: "15 câu hỏi kịch tính với phần quà ảo.",
    suitable: "Tất cả các môn",
    type: "Ai là triệu phú lớp học"
  },
  {
    id: "golden-bell",
    name: "Rung chuông vàng mini",
    description: "Trả lời liên tục để dành chiến thắng.",
    suitable: "Tất cả các môn",
    type: "Rung chuông vàng mini"
  },
  {
    id: "escape",
    name: "Game thoát khỏi phòng",
    description: "Giải vây bằng trí tuệ và sự logic.",
    suitable: "Tin học, Lý, Hóa, Ngoại ngữ",
    type: "Thoát khỏi căn phòng bí mật"
  }
];

export const AUXILIARY_PROMPTS = [
  {
    name: "Nâng cấp giao diện",
    prompt: "Hãy nâng cấp giao diện game hiện tại cho đẹp, hiện đại và chuyên nghiệp hơn. Sử dụng màu sắc hài hòa, font chữ đẹp, các nút bấm có hiệu ứng hover mượt mà và bố cục responsive tốt."
  },
  {
    name: "Thêm âm thanh & hiệu ứng",
    prompt: "Hãy thêm hiệu ứng âm thanh (đúng, sai, thắng, thua) bằng Web Audio API và các hiệu ứng chuyển động (animation) sinh động khi người chơi tương tác với game."
  },
  {
    name: "Thêm màn hình cài đặt",
    prompt: "Hãy thêm một màn hình 'Cài đặt' dành cho giáo viên, cho phép trực tiếp chỉnh sửa câu hỏi, đáp án, và tải ảnh biểu tượng cho câu hỏi ngay trong trò chơi."
  },
  {
    name: "Thêm xuất/nhập file JSON",
    prompt: "Hãy thêm tính năng cho phép giáo viên xuất toàn bộ ngân hàng câu hỏi hiện tại ra file .json và nhập lại file .json đó để nhanh chóng thay đổi nội dung bài học."
  },
  {
    name: "Sửa lỗi game không chạy",
    prompt: "Dưới đây là mã nguồn của tôi đang gặp lỗi hoặc không hoạt động như mong muốn. Hãy phân tích và sửa lỗi giúp tôi: [DÁN CODE VÀO ĐÂY]"
  },
  {
    name: "Tối ưu cho điện thoại",
    prompt: "Hãy tối ưu lại giao diện và cách chơi để trò chơi hoạt động hoàn hảo trên các thiết bị di động (cảm ứng) và các kích thước màn hình nhỏ."
  }
];
