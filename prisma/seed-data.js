// File: prisma/seed-data.js
// Nội dung mẫu cho ứng dụng Sống Xanh.
// Số liệu được tra từ các nguồn công khai (ghi rõ trong từng bài viết)
// và nên được đối chiếu lại với văn bản gốc trước khi dùng cho báo cáo.

const GREEN_ACTIVITIES = [
  { name: 'Mang chai nước cá nhân', description: 'Giảm sử dụng chai nhựa dùng một lần', points: 1, icon: 'water-bottle' },
  { name: 'Tắt điện khi ra khỏi phòng', description: 'Tiết kiệm năng lượng điện', points: 1, icon: 'light-off' },
  { name: 'Phân loại rác đúng cách', description: 'Giúp tái chế hiệu quả', points: 1, icon: 'recycle-bin' },
  { name: 'Không dùng ống hút nhựa', description: 'Giảm rác thải nhựa', points: 1, icon: 'no-straw' },
  { name: 'Đi học bằng xe đạp/đi bộ', description: 'Giảm khí thải carbon', points: 1, icon: 'bicycle' },
  { name: 'Trồng một cây xanh', description: 'Tăng cường không gian xanh', points: 3, icon: 'plant' },
  { name: 'Tham gia dọn rác cộng đồng', description: 'Dọn dẹp môi trường', points: 5, icon: 'cleanup' },
  { name: 'Mang túi vải đi mua sắm', description: 'Từ chối túi ni-lông dùng một lần', points: 1, icon: 'tote-bag' },
  { name: 'Ăn hết suất ăn, không bỏ thừa', description: 'Giảm rác thực phẩm và lãng phí tài nguyên', points: 1, icon: 'meal' },
  { name: 'Tắt vòi nước khi đánh răng', description: 'Một lần đánh răng có thể tiết kiệm vài lít nước', points: 1, icon: 'tap' },
  { name: 'Dùng lại giấy một mặt', description: 'Tận dụng giấy nháp thay vì bỏ đi', points: 1, icon: 'paper' },
  { name: 'Rút phích cắm thiết bị không dùng', description: 'Tránh điện năng tiêu thụ ở chế độ chờ', points: 1, icon: 'plug' },
  { name: 'Mang hộp đựng đồ ăn riêng', description: 'Hạn chế hộp xốp và túi nhựa khi mua đồ ăn', points: 2, icon: 'lunch-box' },
  { name: 'Gom pin cũ đúng nơi quy định', description: 'Pin là rác nguy hại, không bỏ chung rác sinh hoạt', points: 2, icon: 'battery' },
];

const BADGES = [
  { title: 'Người khởi đầu xanh', description: 'Đạt 10 điểm xanh đầu tiên', points: 10 },
  { title: 'Nhà môi trường nhỏ', description: 'Đạt 30 điểm xanh', points: 30 },
  { title: 'Chiến binh xanh', description: 'Đạt 50 điểm xanh', points: 50 },
  { title: 'Đại sứ môi trường', description: 'Đạt 100 điểm xanh', points: 100 },
  { title: 'Người bảo vệ trái đất', description: 'Đạt 200 điểm xanh', points: 200 },
  { title: 'Huyền thoại xanh', description: 'Đạt 500 điểm xanh', points: 500 },
];

const CHALLENGES = [
  {
    title: 'Tuần không túi ni-lông',
    description: 'Không sử dụng túi ni-lông dùng một lần trong 7 ngày liên tiếp. Mang theo túi vải mỗi khi đi mua đồ.',
    points: 50, days: 7, difficulty: 'Trung bình', category: 'Giảm rác thải',
  },
  {
    title: 'Người tiết kiệm điện',
    description: 'Tắt điện và rút phích cắm thiết bị khi không sử dụng trong 5 ngày liên tiếp.',
    points: 30, days: 5, difficulty: 'Dễ', category: 'Tiết kiệm năng lượng',
  },
  {
    title: '30 ngày sống xanh',
    description: 'Thực hiện ít nhất 3 hành vi xanh mỗi ngày trong 30 ngày.',
    points: 200, days: 30, difficulty: 'Khó', category: 'Tổng hợp', requiredPoints: 100,
  },
  {
    title: 'Tuần lễ không ống hút nhựa',
    description: 'Từ chối ống hút nhựa trong 7 ngày. Dùng ống hút giấy, inox hoặc uống trực tiếp.',
    points: 40, days: 7, difficulty: 'Dễ', category: 'Giảm rác thải',
  },
  {
    title: 'Phân loại rác tại nhà',
    description: 'Phân loại rác thành 3 nhóm theo Luật Bảo vệ môi trường 2020: rác tái chế, rác thực phẩm và rác còn lại, liên tục 14 ngày.',
    points: 80, days: 14, difficulty: 'Trung bình', category: 'Phân loại rác',
  },
  {
    title: 'Đi bộ hoặc xe đạp đến trường',
    description: 'Không dùng xe máy, ô tô để đến trường trong 10 ngày học.',
    points: 70, days: 10, difficulty: 'Trung bình', category: 'Giao thông xanh',
  },
  {
    title: 'Không bỏ thừa thức ăn',
    description: 'Ăn hết suất ăn, không để thừa trong 7 ngày liên tiếp.',
    points: 35, days: 7, difficulty: 'Dễ', category: 'Chống lãng phí',
  },
  {
    title: 'Chiến dịch trồng cây',
    description: 'Trồng và chăm sóc ít nhất một cây xanh trong 21 ngày, ghi lại sự phát triển mỗi tuần.',
    points: 120, days: 21, difficulty: 'Trung bình', category: 'Trồng cây', requiredPoints: 50,
  },
  {
    title: 'Tháng tiết kiệm nước',
    description: 'Tắt vòi khi đánh răng, tắm nhanh hơn 5 phút, tái sử dụng nước vo gạo để tưới cây trong 30 ngày.',
    points: 150, days: 30, difficulty: 'Khó', category: 'Tiết kiệm nước', requiredPoints: 80,
  },
  {
    title: 'Lan tỏa lối sống xanh',
    description: 'Rủ ít nhất 3 bạn cùng tham gia ứng dụng và cùng hoàn thành một thử thách.',
    points: 60, days: 14, difficulty: 'Trung bình', category: 'Cộng đồng',
  },
];

const DAILY_MISSIONS = [
  { title: 'Uống nước bằng bình cá nhân', description: 'Dùng bình nước riêng thay cho chai nhựa dùng một lần.', points: 5, icon: '🧴', category: 'Giảm nhựa' },
  { title: 'Tắt đèn khi rời phòng', description: 'Kiểm tra và tắt hết đèn, quạt khi bạn là người cuối cùng rời phòng.', points: 5, icon: '💡', category: 'Tiết kiệm điện' },
  { title: 'Phân loại rác hôm nay', description: 'Tách rác tái chế ra khỏi rác thực phẩm và rác còn lại.', points: 10, icon: '♻️', category: 'Phân loại rác' },
  { title: 'Mang túi vải khi đi mua đồ', description: 'Từ chối túi ni-lông ít nhất một lần trong ngày.', points: 10, icon: '👜', category: 'Giảm nhựa' },
  { title: 'Đi bộ hoặc đạp xe', description: 'Chọn phương tiện không phát thải cho ít nhất một chặng đi trong ngày.', points: 10, icon: '🚲', category: 'Giao thông xanh' },
  { title: 'Ăn hết suất ăn', description: 'Không để thừa thức ăn trong bữa trưa hoặc bữa tối.', points: 5, icon: '🍚', category: 'Chống lãng phí' },
  { title: 'Tắt vòi khi đánh răng', description: 'Chỉ mở vòi khi cần, có thể tiết kiệm vài lít nước mỗi lần.', points: 5, icon: '🚰', category: 'Tiết kiệm nước' },
  { title: 'Dùng giấy hai mặt', description: 'Viết hoặc in trên cả hai mặt giấy để giảm lượng giấy dùng.', points: 5, icon: '📄', category: 'Chống lãng phí' },
  { title: 'Nhặt một mảnh rác', description: 'Nhặt ít nhất một mảnh rác bạn nhìn thấy và bỏ vào đúng thùng.', points: 5, icon: '🧹', category: 'Cộng đồng' },
  { title: 'Rút phích cắm thiết bị', description: 'Rút sạc điện thoại, laptop khi đã sạc đầy để tránh hao điện chờ.', points: 5, icon: '🔌', category: 'Tiết kiệm điện' },
  { title: 'Chia sẻ một mẹo sống xanh', description: 'Kể cho bạn bè hoặc người thân nghe một mẹo sống xanh bạn vừa học.', points: 10, icon: '💬', category: 'Cộng đồng' },
  { title: 'Tưới cây bằng nước tái sử dụng', description: 'Dùng nước vo gạo hoặc nước rửa rau để tưới cây.', points: 10, icon: '🌱', category: 'Tiết kiệm nước' },
];

const DEVICES = [
  { name: 'Điều hòa 9000 BTU', type: 'electric', wattage: 900 },
  { name: 'Điều hòa 12000 BTU', type: 'electric', wattage: 1200 },
  { name: 'Quạt điện', type: 'electric', wattage: 50 },
  { name: 'Bóng đèn LED', type: 'electric', wattage: 9 },
  { name: 'Bóng đèn sợi đốt', type: 'electric', wattage: 60 },
  { name: 'Tủ lạnh', type: 'electric', wattage: 120 },
  { name: 'Máy tính để bàn', type: 'electric', wattage: 200 },
  { name: 'Laptop', type: 'electric', wattage: 65 },
  { name: 'Tivi LED 43 inch', type: 'electric', wattage: 80 },
  { name: 'Máy giặt', type: 'electric', wattage: 500 },
  { name: 'Ấm đun nước siêu tốc', type: 'electric', wattage: 1500 },
  { name: 'Vòi sen', type: 'water', litersPerHour: 540 },
  { name: 'Vòi rửa tay', type: 'water', litersPerHour: 360 },
  { name: 'Máy giặt (nước)', type: 'water', litersPerHour: 120 },
];

const PRODUCTS = [
  {
    barcode: '8938507968047', name: 'Nước khoáng Lavie 500ml', brand: 'Lavie',
    category: 'Đồ uống', packaging: 'Chai nhựa', greenScore: 6.5,
    recyclable: true, biodegradable: false, plasticFree: false,
    recommendation: 'Tái chế vỏ chai sau khi sử dụng. Hoặc thay thế bằng bình nước cá nhân.',
  },
  {
    barcode: '8934563138165', name: 'Ống hút giấy ECO 100 cái', brand: 'ECO',
    category: 'Đồ dùng', packaging: 'Hộp giấy', greenScore: 8.7,
    recyclable: true, biodegradable: true, plasticFree: true,
    recommendation: 'Sản phẩm thân thiện với môi trường, thay thế tốt cho ống hút nhựa.',
  },
  {
    barcode: '8935049501234', name: 'Túi vải canvas đi chợ', brand: 'GreenLife',
    category: 'Đồ dùng', packaging: 'Không bao bì', greenScore: 9.2,
    recyclable: true, biodegradable: true, plasticFree: true,
    recommendation: 'Dùng được hàng trăm lần, thay thế trực tiếp túi ni-lông dùng một lần.',
  },
  {
    barcode: '8936012345678', name: 'Bàn chải tre', brand: 'BamBoo Vietnam',
    category: 'Chăm sóc cá nhân', packaging: 'Hộp giấy', greenScore: 8.5,
    recyclable: false, biodegradable: true, plasticFree: false,
    recommendation: 'Cán tre phân hủy được, nhưng lông bàn chải thường vẫn là nhựa — hãy rút lông ra trước khi bỏ.',
  },
  {
    barcode: '8935217400010', name: 'Hộp xốp đựng cơm dùng một lần', brand: 'Không rõ',
    category: 'Đồ dùng', packaging: 'Xốp EPS', greenScore: 1.8,
    recyclable: false, biodegradable: false, plasticFree: false,
    recommendation: 'Rất khó tái chế và phân hủy. Hãy mang hộp đựng riêng khi mua đồ ăn mang về.',
  },
  {
    barcode: '8934673100014', name: 'Nước ngọt lon 330ml', brand: 'Không rõ',
    category: 'Đồ uống', packaging: 'Lon nhôm', greenScore: 7.0,
    recyclable: true, biodegradable: false, plasticFree: true,
    recommendation: 'Lon nhôm tái chế được nhiều lần. Hãy bóp dẹp và bỏ vào thùng rác tái chế.',
  },
  {
    barcode: '8938505974112', name: 'Bình giữ nhiệt inox 500ml', brand: 'LocknLock',
    category: 'Đồ dùng', packaging: 'Hộp giấy', greenScore: 9.0,
    recyclable: true, biodegradable: false, plasticFree: true,
    recommendation: 'Một bình giữ nhiệt dùng lâu dài thay thế cho hàng trăm chai nhựa mỗi năm.',
  },
  {
    barcode: '8935024140017', name: 'Túi ni-lông siêu thị', brand: 'Không rõ',
    category: 'Đồ dùng', packaging: 'Nhựa PE', greenScore: 1.2,
    recyclable: false, biodegradable: false, plasticFree: false,
    recommendation: 'Theo nhiều nguồn, túi ni-lông cần 500–1.000 năm để phân hủy. Hãy dùng túi vải thay thế.',
  },
];

const REWARDS = [
  { title: 'Bút chì gỗ tái chế', description: 'Bộ 5 bút chì làm từ gỗ tái chế, thân thiện với môi trường.', points: 20, category: 'Văn phòng phẩm', stock: 50 },
  { title: 'Sổ tay giấy tái chế', description: 'Sổ tay 100 trang làm từ giấy tái chế 100%.', points: 40, category: 'Văn phòng phẩm', stock: 30 },
  { title: 'Bình nước cá nhân', description: 'Bình nước inox 500ml, dùng thay cho chai nhựa một lần.', points: 120, category: 'Đồ dùng', stock: 20 },
  { title: 'Túi vải canvas Sống Xanh', description: 'Túi vải dùng nhiều lần, thay thế túi ni-lông khi đi mua sắm.', points: 80, category: 'Đồ dùng', stock: 25 },
  { title: 'Hạt giống cây xanh', description: 'Gói hạt giống kèm hướng dẫn trồng và chăm sóc.', points: 30, category: 'Cây xanh', stock: 60 },
  { title: 'Cây xương rồng mini', description: 'Chậu xương rồng mini để bàn học, dễ chăm sóc.', points: 90, category: 'Cây xanh', stock: 15 },
  { title: 'Voucher nhà sách 50.000đ', description: 'Phiếu mua sách giảm giá 50.000đ tại nhà sách liên kết.', points: 200, category: 'Voucher', stock: 10 },
  { title: 'Bộ dụng cụ học tập xanh', description: 'Bộ thước, gọt bút và cục gôm làm từ vật liệu tái chế.', points: 150, category: 'Dụng cụ học tập', stock: 12 },
  { title: 'Ống hút inox kèm cọ rửa', description: 'Bộ 2 ống hút inox và cọ vệ sinh, thay thế ống hút nhựa.', points: 60, category: 'Đồ dùng', stock: 40 },
  { title: 'Hộp đựng cơm bằng thép', description: 'Hộp cơm 2 ngăn, mang đi học thay cho hộp xốp dùng một lần.', points: 180, category: 'Đồ dùng', stock: 8 },
];

// Bài viết: nội dung tổng hợp từ các nguồn công khai, có ghi nguồn ở cuối bài.
const ARTICLES = [
  {
    title: 'Phân loại rác tại nguồn: 3 nhóm bạn cần nhớ',
    category: 'Phân loại rác',
    readTime: '4 phút đọc',
    excerpt:
      'Luật Bảo vệ môi trường 2020 chia rác sinh hoạt thành 3 nhóm. Nắm được 3 nhóm này là bạn đã làm đúng phần lớn công việc phân loại.',
    content: `
<h2>Vì sao phải phân loại rác?</h2>
<p>Rác không được phân loại thì gần như toàn bộ phải đem chôn lấp hoặc đốt, kể cả phần vốn có thể tái chế. Phân loại ngay tại nhà là bước rẻ nhất và hiệu quả nhất để giữ lại giá trị của rác.</p>

<h2>Ba nhóm theo Luật Bảo vệ môi trường 2020</h2>
<p>Luật Bảo vệ môi trường 2020 quy định chất thải rắn sinh hoạt được phân thành ba nhóm:</p>
<ul>
  <li><strong>Chất thải có khả năng tái sử dụng, tái chế</strong> — giấy, bìa carton, chai nhựa sạch, lon nhôm, kim loại, thủy tinh.</li>
  <li><strong>Chất thải thực phẩm</strong> — thức ăn thừa, vỏ rau củ quả, bã trà, bã cà phê.</li>
  <li><strong>Chất thải rắn sinh hoạt khác</strong> — phần còn lại không thuộc hai nhóm trên.</li>
</ul>
<p>Lộ trình thực hiện phân loại được đặt ra chậm nhất đến ngày 31/12/2024.</p>

<h2>Có bị phạt nếu không phân loại không?</h2>
<p>Nghị định 45/2022/NĐ-CP quy định phạt tiền từ 500.000 đồng đến 1.000.000 đồng đối với hộ gia đình, cá nhân không phân loại chất thải rắn sinh hoạt theo quy định hoặc không sử dụng bao bì chứa chất thải theo quy định. Nghị định này có hiệu lực từ ngày 25/8/2022.</p>
<p>Lưu ý: thời điểm thực sự áp dụng xử phạt ở từng địa phương có thể khác nhau, bạn nên theo dõi hướng dẫn của UBND nơi mình sống.</p>

<h2>Ba thói quen nhỏ nên bắt đầu ngay</h2>
<ol>
  <li>Để sẵn 3 thùng hoặc 3 túi riêng ở nhà, dán nhãn rõ ràng.</li>
  <li>Rửa qua và để khô chai lọ, lon trước khi bỏ vào nhóm tái chế — rác tái chế dính thức ăn thường bị loại.</li>
  <li>Pin, bóng đèn hỏng, thuốc hết hạn là rác nguy hại, phải để riêng chứ không bỏ chung rác sinh hoạt.</li>
</ol>

<p><em>Nguồn tham khảo: Luật Bảo vệ môi trường 2020; Nghị định 45/2022/NĐ-CP; Báo Pháp Luật TP.HCM; Cổng thông tin điện tử tỉnh Hà Tĩnh.</em></p>
`.trim(),
  },
  {
    title: 'Rác nhựa ở Việt Nam: những con số đáng suy nghĩ',
    category: 'Rác thải nhựa',
    readTime: '5 phút đọc',
    excerpt:
      'Khoảng 1,8 triệu tấn rác nhựa được thải ra mỗi năm, nhưng chỉ một phần nhỏ được tái chế. Những con số này nói lên điều gì?',
    content: `
<h2>Việt Nam thải bao nhiêu rác nhựa?</h2>
<p>Theo số liệu được dẫn từ Bộ Tài nguyên và Môi trường, mỗi năm Việt Nam có khoảng <strong>1,8 triệu tấn rác thải nhựa</strong> thải ra môi trường, trong đó chỉ khoảng <strong>27%</strong> được tái chế.</p>
<p>Lượng rác nhựa đi ra biển được ước tính trong khoảng <strong>0,28 – 0,73 triệu tấn mỗi năm</strong>. Đây là khoảng ước tính khá rộng, cho thấy việc đo đạc chính xác vẫn còn là thách thức.</p>

<h2>Nhựa mất bao lâu để phân hủy?</h2>
<p>Các con số dưới đây là ước tính phổ biến, thời gian thực tế phụ thuộc vào ánh sáng, nhiệt độ và việc rác bị chôn lấp hay nằm ngoài tự nhiên:</p>
<ul>
  <li>Túi ni-lông: khoảng <strong>500 – 1.000 năm</strong></li>
  <li>Chai nhựa: khoảng <strong>450 – 1.000 năm</strong></li>
  <li>Ống hút, nắp chai: khoảng <strong>100 – 500 năm</strong></li>
  <li>Bàn chải đánh răng nhựa: khoảng <strong>500 năm</strong></li>
</ul>
<p>Điều quan trọng hơn con số: nhựa không biến mất hẳn mà vỡ dần thành <strong>vi nhựa</strong>, lẫn vào đất, nước và chuỗi thức ăn.</p>

<h2>Mục tiêu quốc gia</h2>
<p>Việt Nam đặt mục tiêu đến năm 2030 giảm <strong>75% rác thải nhựa đại dương</strong>.</p>

<h2>Một học sinh có thể làm gì?</h2>
<p>Đổi một chai nhựa mỗi ngày sang bình nước cá nhân là khoảng 180 chai mỗi năm học. Nhân với một lớp 40 bạn là hơn 7.000 chai. Thay đổi nhỏ nhưng nhân lên thì không nhỏ.</p>

<p><em>Nguồn tham khảo: Cổng thông tin điện tử tỉnh Hà Tĩnh (dẫn số liệu Bộ TN&MT); Báo Đại Đoàn Kết; Thời báo Tài chính Việt Nam; World Bank Blogs.</em></p>
`.trim(),
  },
  {
    title: 'Dùng điều hòa sao cho đỡ tốn điện',
    category: 'Tiết kiệm năng lượng',
    readTime: '4 phút đọc',
    excerpt:
      'Tăng một độ trên điều khiển có thể giảm 7–10% điện năng tiêu thụ. Vài thói quen đơn giản giúp hóa đơn tiền điện nhẹ đi rõ rệt.',
    content: `
<h2>Một độ cũng tạo khác biệt</h2>
<p>Theo các hướng dẫn sử dụng điều hòa được công bố rộng rãi, việc <strong>tăng nhiệt độ cài đặt lên 1°C có thể giảm lượng điện tiêu thụ khoảng 7% đến 10%</strong>. Đây là cách tiết kiệm dễ làm nhất vì chỉ cần bấm điều khiển.</p>

<h2>26°C hay 28°C?</h2>
<p>Mức 26°C thường được khuyến nghị là nhiệt độ dễ chịu và tương đối tiết kiệm. Một số ý kiến cho rằng cài 28°C còn tiết kiệm hơn vì chênh lệch với nhiệt độ ngoài trời nhỏ hơn nên máy phải chạy ít hơn. Trên thực tế, hiệu quả phụ thuộc vào chênh lệch nhiệt độ trong và ngoài nhà, độ kín của phòng và tình trạng máy.</p>

<h2>Những mẹo đã được nhiều nguồn nhắc tới</h2>
<ul>
  <li><strong>Bật thêm quạt:</strong> kết hợp quạt với điều hòa giúp tiết kiệm khoảng 2–3% điện năng so với việc hạ nhiệt độ xuống thấp hơn.</li>
  <li><strong>Đóng kín cửa phòng:</strong> để hơi lạnh không thoát ra ngoài.</li>
  <li><strong>Vệ sinh, bảo dưỡng định kỳ:</strong> lưới lọc bẩn làm máy chạy nặng hơn và tốn điện hơn.</li>
  <li><strong>Không bật 24/24:</strong> chỉ dùng vào lúc thật cần, như giấc trưa hoặc ban đêm.</li>
  <li><strong>Rút phích cắm thiết bị không dùng:</strong> giảm điện năng tiêu thụ ở chế độ chờ.</li>
</ul>

<h2>Thử tính ở trang Tiết kiệm</h2>
<p>Bạn có thể vào mục <strong>Tiết kiệm</strong> trong ứng dụng, khai báo các thiết bị trong nhà và số giờ dùng mỗi ngày để ước tính lượng điện và nước mình đang tiêu thụ.</p>

<p><em>Nguồn tham khảo: Tạp chí Công Thương; FPT Shop; Tin nhanh Chứng khoán; Báo Tuổi Trẻ.</em></p>
`.trim(),
  },
  {
    title: 'Bắt đầu sống xanh: 10 việc làm được ngay tuần này',
    category: 'Mẹo sống xanh',
    readTime: '3 phút đọc',
    excerpt:
      'Không cần thay đổi cả cuộc sống. Mười việc dưới đây đều làm được trong một tuần, và mỗi việc đều có thể ghi nhận điểm trong ứng dụng.',
    content: `
<h2>Mười việc nhỏ, bắt đầu từ hôm nay</h2>
<ol>
  <li><strong>Mang bình nước cá nhân</strong> đi học thay vì mua chai nhựa.</li>
  <li><strong>Nói "không cần túi"</strong> khi mua một hai món đồ nhỏ.</li>
  <li><strong>Tắt đèn, quạt</strong> khi là người cuối cùng rời phòng.</li>
  <li><strong>Tắt vòi nước khi đánh răng</strong> — chỉ mở khi cần súc miệng.</li>
  <li><strong>Dùng giấy hai mặt</strong> cho bài nháp và bài tập.</li>
  <li><strong>Ăn hết suất ăn</strong>, lấy vừa đủ thay vì lấy nhiều rồi bỏ.</li>
  <li><strong>Để riêng chai lọ, lon</strong> đã rửa sạch vào một túi tái chế.</li>
  <li><strong>Gom pin cũ</strong> vào một hộp riêng, mang đến điểm thu gom.</li>
  <li><strong>Đi bộ hoặc đạp xe</strong> cho những quãng đường ngắn.</li>
  <li><strong>Rủ một người bạn</strong> cùng làm — thói quen dễ giữ hơn khi có đồng đội.</li>
</ol>

<h2>Ghi nhận để thấy tiến bộ</h2>
<p>Mỗi việc bạn đánh dấu ở mục <strong>Hành động</strong> đều được cộng điểm xanh. Điểm này dùng để mở huy hiệu, leo bảng xếp hạng lớp và đổi quà ở mục <strong>Đổi quà</strong>.</p>

<h2>Mẹo giữ thói quen</h2>
<p>Đừng cố làm cả mười việc cùng lúc. Chọn hai việc dễ nhất với bạn, làm đủ bảy ngày liên tiếp, rồi mới thêm việc thứ ba.</p>
`.trim(),
  },
  {
    title: 'Đọc nhãn sản phẩm: thế nào là thân thiện môi trường?',
    category: 'Tiêu dùng xanh',
    readTime: '4 phút đọc',
    excerpt:
      'Không phải cứ ghi "eco" là xanh. Vài dấu hiệu giúp bạn đánh giá nhanh một sản phẩm trước khi mua.',
    content: `
<h2>Nhìn vào bao bì trước tiên</h2>
<p>Bao bì thường chiếm phần lớn rác thải của một sản phẩm. Thứ tự ưu tiên thường là: <strong>không bao bì → giấy/bìa → thủy tinh, kim loại → nhựa</strong>. Hộp xốp EPS là lựa chọn kém nhất vì vừa khó tái chế vừa khó phân hủy.</p>

<h2>Ba câu hỏi nhanh</h2>
<ul>
  <li><strong>Tái chế được không?</strong> Chai PET, lon nhôm, bìa carton thường tái chế được nếu sạch và khô.</li>
  <li><strong>Phân hủy sinh học được không?</strong> Giấy, tre, gỗ thường có; nhựa "phân hủy" nhiều khi chỉ vỡ vụn thành vi nhựa.</li>
  <li><strong>Dùng được bao nhiêu lần?</strong> Một chiếc túi vải dùng hàng trăm lần luôn tốt hơn hàng trăm túi ni-lông.</li>
</ul>

<h2>Cẩn thận với "greenwashing"</h2>
<p>Một số sản phẩm dùng màu xanh lá, hình chiếc lá hoặc chữ "eco", "thiên nhiên" trên bao bì mà không có thay đổi thật về vật liệu. Hãy đọc phần ghi chất liệu thay vì tin vào hình ảnh.</p>

<h2>Quét mã để biết nhanh</h2>
<p>Bạn có thể dùng mục <strong>Quét mã</strong> trong ứng dụng để quét mã vạch sản phẩm. Ứng dụng sẽ tra cơ sở dữ liệu và chấm điểm xanh từ 0 đến 10, kèm gợi ý thay thế nếu sản phẩm kém thân thiện.</p>

<h2>Ví dụ so sánh</h2>
<p>Bình giữ nhiệt inox (điểm xanh khoảng 9,0) so với hộp xốp đựng cơm dùng một lần (khoảng 1,8): cùng phục vụ một nhu cầu, nhưng một bên dùng được nhiều năm, một bên bỏ đi sau một bữa.</p>
`.trim(),
  },
  {
    title: 'Vì sao trồng cây lại quan trọng đến thế?',
    category: 'Trồng cây',
    readTime: '3 phút đọc',
    excerpt:
      'Cây xanh không chỉ hấp thụ CO₂. Chúng còn làm mát không khí, giữ đất và tạo chỗ sống cho rất nhiều loài.',
    content: `
<h2>Cây làm được những gì?</h2>
<ul>
  <li><strong>Hấp thụ CO₂:</strong> cây lấy khí carbonic trong quá trình quang hợp và giữ carbon trong thân, cành, rễ.</li>
  <li><strong>Làm mát:</strong> bóng cây và hơi nước thoát từ lá giúp hạ nhiệt khu vực xung quanh, đặc biệt ở thành phố.</li>
  <li><strong>Giữ đất, giảm ngập:</strong> rễ cây giữ đất khỏi xói mòn và giúp nước mưa thấm xuống thay vì chảy tràn.</li>
  <li><strong>Tạo nơi sống:</strong> một cây lớn có thể là nhà của chim, côn trùng và nhiều sinh vật khác.</li>
</ul>

<h2>Trồng rồi phải chăm</h2>
<p>Một cây được trồng nhưng không ai chăm thường chết trong vài tháng đầu. Ba việc quan trọng nhất:</p>
<ol>
  <li>Tưới đều trong mùa khô, nhất là năm đầu tiên.</li>
  <li>Không để cỏ dại hoặc rác che kín gốc.</li>
  <li>Chọn giống phù hợp với đất và khí hậu nơi bạn sống.</li>
</ol>

<h2>Tập trước trong trò chơi</h2>
<p>Mục <strong>Trò chơi</strong> có trò <em>Trồng cây</em>, nơi bạn chăm một cây ảo mỗi ngày để hiểu quy trình. Nhưng cây thật vẫn cần tay bạn — hãy thử thách bản thân với <em>Chiến dịch trồng cây</em> trong mục Thử thách.</p>
`.trim(),
  },
];

// --- Nội dung trò chơi, trước đây cắm cứng trong mã nguồn ---

const QUIZ_QUESTIONS = [
  {
    "question": "Loại rác nào dưới đây mất thời gian phân hủy lâu nhất?",
    "options": [
      "Vỏ chuối",
      "Hộp giấy",
      "Chai nhựa",
      "Túi ni-lông"
    ],
    "correctAnswer": 3,
    "explanation": "• Vỏ chuối: phân hủy rất nhanh, chỉ mất vài ngày đến vài tuần.\n• Hộp giấy: phân hủy trong vài tháng.\n• Chai nhựa: mất hàng trăm năm để phân hủy.\n• Túi ni-lông: có thể mất từ 500 đến 1.000 năm, thậm chí không phân hủy hoàn toàn, mà chỉ vỡ thành vi nhựa gây ô nhiễm lâu dài.\n👉 Vì vậy, Túi ni-lông là loại rác mất thời gian phân hủy lâu nhất.",
    "topic": "Chung",
    "order": 1
  },
  {
    "question": "Khí nào là nguyên nhân chính gây ra hiệu ứng nhà kính trên Trái Đất?",
    "options": [
      "CO2",
      "Ozone",
      "H2O",
      "Nitơ"
    ],
    "correctAnswer": 0,
    "explanation": "•\tCO₂ là khí nhà kính chủ yếu do con người thải ra từ việc đốt nhiên liệu hóa thạch (than, dầu, khí đốt), phá rừng, sản xuất công nghiệp...\n•\tCác khí nhà kính khác như CH₄ (mêtan), N₂O (nitơ oxit), và hơi nước (H₂O) cũng góp phần, nhưng CO₂ là nguyên nhân chính và ổn định lâu dài nhất trong khí quyển.\n•\tOzone (O₃) và Nitơ (N₂) không phải là nguyên nhân chính gây ra hiệu ứng nhà kính.",
    "topic": "Chung",
    "order": 2
  },
  {
    "question": "Lượng nước uống tối thiểu mà mỗi người trưởng thành cần cung cấp cho cơ thể một ngày là bao nhiêu?",
    "options": [
      "0,5 lít",
      "1 lít",
      "1,5-2 lít",
      "3-4 lít"
    ],
    "correctAnswer": 2,
    "explanation": "Theo WHO, một người trưởng thành cần uống khoảng 1,5 đến 2 lít nước mỗi ngày (tương đương 6–8 ly) để duy trì hoạt động trao đổi chất, điều hòa thân nhiệt và loại bỏ chất thải.",
    "topic": "Chung",
    "order": 3
  },
  {
    "question": "Chất thải nào sau đây không nên xả vào bồn cầu để tránh gây tắc nghẽn và ô nhiễm môi trường?",
    "options": [
      "Giấy vệ sinh",
      "Dầu ăn đã qua sử dụng",
      "Nước tiểu",
      "Nước thải tắm gội"
    ],
    "correctAnswer": 1,
    "explanation": "•\tDầu ăn cũ có thể đông đặc, bám vào thành ống thoát nước, gây tắc nghẽn đường ống và ô nhiễm nguồn nước.\n•\tGiấy vệ sinh, nước tiểu và nước tắm gội đều có thể xả được vì chúng dễ phân hủy hoặc được xử lý trong hệ thống nước thải.",
    "topic": "Chung",
    "order": 4
  },
  {
    "question": "Loại năng lượng nào dưới đây là năng lượng tái tạo?",
    "options": [
      "Than đá",
      "Dầu mỏ",
      "Năng lượng mặt trời",
      "Khí đốt tự nhiên"
    ],
    "correctAnswer": 2,
    "explanation": "•\tNăng lượng mặt trời là nguồn năng lượng tái tạo, vì có thể khai thác liên tục và không cạn kiệt theo thời gian.\n•\tTrong khi đó, than đá, dầu mỏ và khí đốt tự nhiên đều là nhiên liệu hóa thạch, hình thành trong hàng triệu năm và sẽ cạn kiệt nếu khai thác quá mức.",
    "topic": "Chung",
    "order": 5
  },
  {
    "question": "Ký hiệu vòng đồi (Mobius loop) trên sản phẩm có nghĩa là gì?",
    "options": [
      "Sản phẩm có thể được tái chế",
      "Sản phẩm có thể phân hủy nhanh",
      "Sản phẩm nguy hiểm, cần chú ý",
      "Sản phẩm dùng một lần"
    ],
    "correctAnswer": 0,
    "explanation": "Mobius loop là ký hiệu biểu thị sản phẩm/hộp có thể đưa vào quy trình tái chế.",
    "topic": "Chung",
    "order": 6
  },
  {
    "question": "Loại chất thải nào phù hợp nhất để ủ phân (compost)?",
    "options": [
      "Vỏ rau củ, lá cây",
      "Thịt, dầu mỡ",
      "Nhựa, túi ni-lông",
      "Pin, ắc quy"
    ],
    "correctAnswer": 0,
    "explanation": "Vỏ rau củ và lá cây là chất hữu cơ dễ phân hủy, phù hợp để ủ compost.",
    "topic": "Chung",
    "order": 7
  },
  {
    "question": "Nguyên nhân chính dẫn đến phá rừng trên diện rộng là gì?",
    "options": [
      "Mở rộng diện tích nông nghiệp và chăn nuôi",
      "Sự thay đổi khí hậu tự nhiên",
      "Sóng thần và động đất",
      "Du lịch"
    ],
    "correctAnswer": 0,
    "explanation": "Mở rộng canh tác nông nghiệp và chăn nuôi là nguyên nhân phổ biến nhất gây mất rừng.",
    "topic": "Chung",
    "order": 8
  },
  {
    "question": "Nguồn năng lượng nào dưới đây hầu như không tạo trực tiếp khí CO₂ khi phát điện?",
    "options": [
      "Đốt than",
      "Khí tự nhiên",
      "Năng lượng gió",
      "Dầu mỏ"
    ],
    "correctAnswer": 2,
    "explanation": "Tua-bin gió không đốt nhiên liệu nên không thải CO₂ trực tiếp khi phát điện.",
    "topic": "Chung",
    "order": 9
  },
  {
    "question": "“Bảo tồn đa dạng sinh học” nghĩa là gì?",
    "options": [
      "Bảo vệ sự đa dạng về loài, hệ sinh thái và nguồn gen",
      "Tăng số lượng cây trồng thương mại",
      "Xây dựng nhiều khu công nghiệp hơn",
      "Chỉ bảo vệ các loài động vật to lớn"
    ],
    "correctAnswer": 0,
    "explanation": "Bảo tồn đa dạng sinh học là bảo vệ nhiều dạng sống và hệ sinh thái khác nhau.",
    "topic": "Chung",
    "order": 10
  },
  {
    "question": "Hành động nào sau đây giúp tiết kiệm nước trong sinh hoạt hàng ngày?",
    "options": [
      "Tắt vòi khi đánh răng",
      "Rửa xe bằng vòi xả liên tục",
      "Tắm vòi phun liên tục 30 phút",
      "Rửa chén bằng vòi nước mở to"
    ],
    "correctAnswer": 0,
    "explanation": "Tắt vòi khi đánh răng là một cách đơn giản nhưng hiệu quả để tiết kiệm nước.",
    "topic": "Chung",
    "order": 11
  },
  {
    "question": "Khí nào sau đây có tiềm năng gây hiệu ứng nhà kính (GWP) lớn hơn CO₂ trên mỗi đơn vị khối lượng?",
    "options": [
      "O₂ (oxy)",
      "CH₄ (methane)",
      "N₂ (nitơ)",
      "He (heli)"
    ],
    "correctAnswer": 1,
    "explanation": "Methane (CH₄) có GWP lớn hơn CO₂ trên cùng khối lượng trong khoảng thời gian ngắn hạn.",
    "topic": "Chung",
    "order": 12
  },
  {
    "question": "Khoảng thời gian để 1 lon nhôm phân hủy trong môi trường tự nhiên thường là bao lâu?",
    "options": [
      "50 năm",
      "200 - 500 năm",
      "10 năm",
      "1 năm"
    ],
    "correctAnswer": 1,
    "explanation": "Lon nhôm có thể tồn tại hàng trăm năm nếu không được tái chế.",
    "topic": "Chung",
    "order": 13
  },
  {
    "question": "Biện pháp nào hiệu quả nhất để giảm rác nhựa dùng một lần khi đi mua sắm?",
    "options": [
      "Mang theo túi vải/túi tái sử dụng",
      "Yêu cầu túi nhựa lớn hơn",
      "Mua nhiều hơn một loại sản phẩm",
      "Dùng bao nilon miễn phí ở cửa hàng"
    ],
    "correctAnswer": 0,
    "explanation": "Mang túi vải/túi tái sử dụng giảm nhu cầu dùng túi nhựa mới mỗi lần mua sắm.",
    "topic": "Chung",
    "order": 14
  },
  {
    "question": "Khái niệm “kinh tế tuần hoàn” (circular economy) nhấn mạnh điều gì?",
    "options": [
      "Tăng tiêu dùng để phát triển kinh tế",
      "Giảm, tái sử dụng và tái chế để giữ nguyên giá trị tài nguyên",
      "Tập trung khai thác tài nguyên tự nhiên nhiều hơn",
      "Sử dụng càng nhiều đồ dùng một lần càng tốt"
    ],
    "correctAnswer": 1,
    "explanation": "Kinh tế tuần hoàn hướng đến giảm rác thải bằng cách giữ tài nguyên trong sử dụng lâu hơn (reduce-reuse-recycle).",
    "topic": "Chung",
    "order": 15
  },
  {
    "question": "Nhựa PET (ký hiệu số 1 trong tam giác tái chế) thường được làm từ gì và có thể tái chế thành gì?",
    "options": [
      "Làm chai nước uống, tái chế thành sợi vải hoặc chai mới",
      "Làm hộp thức ăn, tái chế thành xăng",
      "Làm ống nước, không thể tái chế",
      "Làm túi nhựa, tái chế thành phân bón"
    ],
    "correctAnswer": 0,
    "explanation": "Nhựa PET (số 1) phổ biến trong chai nước uống và có thể tái chế thành sợi vải polyester hoặc chai mới.",
    "topic": "Chung",
    "order": 16
  },
  {
    "question": "Rác điện tử (e-waste) như điện thoại cũ, máy tính cần được xử lý như thế nào?",
    "options": [
      "Vứt vào thùng rác thông thường",
      "Đốt để giảm thể tích",
      "Đưa đến trung tâm thu gom rác điện tử chuyên dụng",
      "Chôn lấp trong vườn"
    ],
    "correctAnswer": 2,
    "explanation": "Rác điện tử chứa kim loại nặng độc hại như chì, thủy ngân. Cần đưa đến điểm thu gom chuyên dụng để tái chế an toàn.",
    "topic": "Chung",
    "order": 17
  },
  {
    "question": "Loại rác nào KHÔNG nên cho vào thùng ủ phân (compost)?",
    "options": [
      "Vỏ trái cây",
      "Cà phê bã",
      "Xương thịt, mỡ động vật",
      "Lá cây"
    ],
    "correctAnswer": 2,
    "explanation": "Xương và mỡ động vật phân hủy chậm, tạo mùi hôi và thu hút côn trùng có hại. Chỉ nên ủ phân rác hữu cơ từ thực vật.",
    "topic": "Chung",
    "order": 18
  },
  {
    "question": "Nguyên tắc \"3R\" trong bảo vệ môi trường là gì?",
    "options": [
      "Recycle – Reuse – Reduce (Tái chế – Tái sử dụng – Giảm thiểu)",
      "Repair – Replace – Renew (Sửa chữa – Thay thế – Đổi mới)",
      "Refuse – Remove – Restore (Từ chối – Loại bỏ – Phục hồi)",
      "Rethink – Rebuild – Rehome (Suy nghĩ lại – Xây dựng lại – Tái định cư)"
    ],
    "correctAnswer": 0,
    "explanation": "3R là Reduce (giảm rác phát sinh), Reuse (tái sử dụng sản phẩm), Recycle (tái chế vật liệu). Thứ tự ưu tiên giảm dần.",
    "topic": "Chung",
    "order": 19
  },
  {
    "question": "Bãi chôn lấp rác thải (landfill) tạo ra khí gì gây hiệu ứng nhà kính?",
    "options": [
      "Khí oxy (O₂)",
      "Khí methane (CH₄)",
      "Khí nitrogen (N₂)",
      "Hơi nước (H₂O)"
    ],
    "correctAnswer": 1,
    "explanation": "Rác hữu cơ trong bãi chôn lấp phân hủy yếm khí tạo ra khí methane (CH₄) – có tác động nhà kính gấp 25 lần CO₂.",
    "topic": "Chung",
    "order": 20
  },
  {
    "question": "Hành vi nào sau đây thể hiện \"tiêu dùng bền vững\" nhất?",
    "options": [
      "Mua nhiều hàng giảm giá dù không cần thiết",
      "Ưu tiên mua sản phẩm có bao bì ít nhựa, nguồn gốc địa phương",
      "Đặt hàng online mỗi ngày để được giao hàng nhanh",
      "Thay điện thoại mới mỗi năm để theo xu hướng"
    ],
    "correctAnswer": 1,
    "explanation": "Tiêu dùng bền vững là chọn sản phẩm thân thiện môi trường, ít bao bì, nguồn gốc địa phương để giảm khí thải vận chuyển.",
    "topic": "Chung",
    "order": 21
  },
  {
    "question": "Sử dụng phương tiện nào giúp giảm lượng khí thải carbon cá nhân nhiều nhất khi đi lại trong thành phố?",
    "options": [
      "Xe máy xăng",
      "Xe ô tô cá nhân",
      "Xe đạp hoặc đi bộ",
      "Xe taxi"
    ],
    "correctAnswer": 2,
    "explanation": "Xe đạp và đi bộ không phát thải CO₂ trực tiếp, đồng thời tốt cho sức khỏe và giảm tắc đường.",
    "topic": "Chung",
    "order": 22
  },
  {
    "question": "Hành động nào sau đây tiết kiệm điện năng nhất trong gia đình?",
    "options": [
      "Tắt đèn khi ra khỏi phòng",
      "Để thiết bị điện ở chế độ standby thay vì tắt hẳn",
      "Mở điều hòa 24/7",
      "Sạc điện thoại qua đêm mỗi ngày"
    ],
    "correctAnswer": 0,
    "explanation": "Tắt đèn và thiết bị điện khi không dùng là thói quen đơn giản nhưng có thể tiết kiệm đáng kể điện năng theo thời gian.",
    "topic": "Chung",
    "order": 23
  },
  {
    "question": "Thùng rác màu xanh lá thường dùng để chứa loại rác nào?",
    "options": [
      "Rác tái chế (nhựa, giấy, kim loại)",
      "Rác hữu cơ (thức ăn thừa, lá cây)",
      "Rác nguy hại (pin, hóa chất)",
      "Rác thông thường"
    ],
    "correctAnswer": 1,
    "explanation": "Theo quy chuẩn phân loại rác tại nhiều địa phương Việt Nam, thùng xanh lá dùng cho rác hữu cơ có thể ủ phân.",
    "topic": "Chung",
    "order": 24
  },
  {
    "question": "Vỏ hộp sữa giấy (như Tetra Pak) thuộc nhóm rác thải nào?",
    "options": [
      "Rác hữu cơ",
      "Rác nguy hại",
      "Rác tái chế",
      "Rác thông thường không tái chế được"
    ],
    "correctAnswer": 2,
    "explanation": "Hộp Tetra Pak làm từ giấy, nhựa và nhôm có thể được tái chế tại các điểm thu gom chuyên dụng để tận dụng nguyên liệu.",
    "topic": "Chung",
    "order": 25
  },
  {
    "question": "Lượng nước uống tối thiểu mà mỗi người trưởng thành cần một ngày là bao nhiêu?",
    "options": [
      "0,5 lít",
      "1 lít",
      "1,5-2 lít",
      "3-4 lít"
    ],
    "correctAnswer": 2,
    "explanation": "Theo WHO, một người trưởng thành cần uống khoảng 1,5 đến 2 lít nước mỗi ngày.",
    "topic": "Chung",
    "order": 26
  },
  {
    "question": "Chất thải nào không nên xả vào bồn cầu để tránh tắc nghẽn và ô nhiễm?",
    "options": [
      "Giấy vệ sinh",
      "Dầu ăn đã qua sử dụng",
      "Nước tiểu",
      "Nước thải tắm gội"
    ],
    "correctAnswer": 1,
    "explanation": "Dầu ăn cũ có thể đông đặc, bám vào thành ống thoát nước gây tắc nghẽn.",
    "topic": "Chung",
    "order": 27
  }
];

const WASTE_ITEMS = [
  {
    "name": "Chai nhựa",
    "emoji": "🍾",
    "category": "recyclable",
    "order": 1
  },
  {
    "name": "Vỏ chuối",
    "emoji": "🍌",
    "category": "organic",
    "order": 2
  },
  {
    "name": "Pin",
    "emoji": "🔋",
    "category": "hazardous",
    "order": 3
  },
  {
    "name": "Giấy báo",
    "emoji": "📰",
    "category": "recyclable",
    "order": 4
  },
  {
    "name": "Vỏ trứng",
    "emoji": "🥚",
    "category": "organic",
    "order": 5
  },
  {
    "name": "Bóng đèn",
    "emoji": "💡",
    "category": "hazardous",
    "order": 6
  },
  {
    "name": "Hộp carton",
    "emoji": "📦",
    "category": "recyclable",
    "order": 7
  },
  {
    "name": "Lá cây",
    "emoji": "🍂",
    "category": "organic",
    "order": 8
  },
  {
    "name": "Thuốc trừ sâu",
    "emoji": "🧪",
    "category": "hazardous",
    "order": 9
  },
  {
    "name": "Túi nilon",
    "emoji": "🛍️",
    "category": "general",
    "order": 10
  },
  {
    "name": "Lon nhôm",
    "emoji": "🥫",
    "category": "recyclable",
    "order": 11
  },
  {
    "name": "Thức ăn thừa",
    "emoji": "🍱",
    "category": "organic",
    "order": 12
  },
  {
    "name": "Khẩu trang y tế",
    "emoji": "😷",
    "category": "hazardous",
    "order": 13
  },
  {
    "name": "Bao bì",
    "emoji": "📄",
    "category": "general",
    "order": 14
  },
  {
    "name": "Chai thủy tinh",
    "emoji": "🍶",
    "category": "recyclable",
    "order": 15
  },
  {
    "name": "Bìa cứng",
    "emoji": "🗃️",
    "category": "recyclable",
    "order": 16
  },
  {
    "name": "Vỏ lon nước ngọt",
    "emoji": "🥤",
    "category": "recyclable",
    "order": 17
  },
  {
    "name": "Báo cũ",
    "emoji": "📜",
    "category": "recyclable",
    "order": 18
  },
  {
    "name": "Bình xịt hóa chất",
    "emoji": "🧴",
    "category": "hazardous",
    "order": 19
  },
  {
    "name": "Vỏ ốc sò",
    "emoji": "🐚",
    "category": "organic",
    "order": 20
  },
  {
    "name": "Túi trà đã dùng",
    "emoji": "🍵",
    "category": "organic",
    "order": 21
  },
  {
    "name": "Nến đã dùng",
    "emoji": "🕯️",
    "category": "general",
    "order": 22
  },
  {
    "name": "Dầu nhớt",
    "emoji": "🛢️",
    "category": "hazardous",
    "order": 23
  },
  {
    "name": "Máy tính bỏ túi",
    "emoji": "🧮",
    "category": "hazardous",
    "order": 24
  },
  {
    "name": "Lõi giấy vệ sinh",
    "emoji": "🧻",
    "category": "recyclable",
    "order": 25
  },
  {
    "name": "Cành cây khô",
    "emoji": "🌿",
    "category": "organic",
    "order": 26
  },
  {
    "name": "Bình ắc quy xe",
    "emoji": "⚡",
    "category": "hazardous",
    "order": 27
  },
  {
    "name": "Màng bọc thực phẩm",
    "emoji": "🎁",
    "category": "general",
    "order": 28
  },
  {
    "name": "Hộp sữa giấy",
    "emoji": "🥛",
    "category": "recyclable",
    "order": 29
  },
  {
    "name": "Giày cũ",
    "emoji": "👟",
    "category": "general",
    "order": 30
  }
];

const BEHAVIOR_ITEMS = [
  {
    "text": "Mang bình nước cá nhân đi học thay vì mua chai nhựa",
    "label": "tot",
    "explain": "Một bình dùng lại thay thế hàng trăm chai nhựa mỗi năm.",
    "order": 1
  },
  {
    "text": "Vứt pin cũ chung với rác sinh hoạt",
    "label": "xau",
    "explain": "Pin là rác nguy hại, kim loại nặng trong pin có thể ngấm vào đất và nước.",
    "order": 2
  },
  {
    "text": "Tắt đèn và quạt khi là người cuối cùng rời phòng",
    "label": "tot",
    "explain": "Giảm điện năng lãng phí mà không tốn công sức gì.",
    "order": 3
  },
  {
    "text": "Để vòi nước chảy suốt lúc đánh răng",
    "label": "xau",
    "explain": "Mỗi lần đánh răng có thể lãng phí vài lít nước sạch.",
    "order": 4
  },
  {
    "text": "Mang túi vải khi đi siêu thị",
    "label": "tot",
    "explain": "Từ chối túi ni-lông, loại rác cần 500–1.000 năm để phân hủy.",
    "order": 5
  },
  {
    "text": "Đốt rác trong vườn nhà",
    "label": "xau",
    "explain": "Đốt rác thải ra khói độc và bụi mịn, ảnh hưởng hô hấp của cả xóm.",
    "order": 6
  },
  {
    "text": "Đi bộ hoặc đạp xe cho quãng đường ngắn",
    "label": "tot",
    "explain": "Không phát thải, lại tốt cho sức khỏe.",
    "order": 7
  },
  {
    "text": "Mua đồ ăn mang về đựng trong hộp xốp dùng một lần",
    "label": "xau",
    "explain": "Hộp xốp rất khó tái chế và gần như không phân hủy.",
    "order": 8
  },
  {
    "text": "Tách riêng chai lọ, lon đã rửa sạch để tái chế",
    "label": "tot",
    "explain": "Rác tái chế sạch mới được thu gom, dính thức ăn thường bị loại.",
    "order": 9
  },
  {
    "text": "Lấy nhiều thức ăn rồi bỏ thừa",
    "label": "xau",
    "explain": "Lãng phí cả thực phẩm lẫn nước, đất và năng lượng đã dùng để làm ra nó.",
    "order": 10
  },
  {
    "text": "Dùng giấy cả hai mặt khi làm bài nháp",
    "label": "tot",
    "explain": "Giảm một nửa lượng giấy, tức giảm số cây phải chặt.",
    "order": 11
  },
  {
    "text": "Xả dầu ăn thừa xuống bồn rửa",
    "label": "xau",
    "explain": "Dầu đông lại gây tắc ống và ô nhiễm nguồn nước.",
    "order": 12
  }
];

module.exports = {
  QUIZ_QUESTIONS,
  WASTE_ITEMS,
  BEHAVIOR_ITEMS,
  GREEN_ACTIVITIES,
  BADGES,
  CHALLENGES,
  DAILY_MISSIONS,
  DEVICES,
  PRODUCTS,
  REWARDS,
  ARTICLES,
};
