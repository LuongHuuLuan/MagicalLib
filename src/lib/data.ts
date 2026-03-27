export interface Tale {
  title: string;
  description: string;
  content: string[];
  category: 'Cổ tích' | 'Truyền thuyết' | 'Thần thoại' | 'Ngụ ngôn';
  origin: string;
  moral: string;
}

export const CATEGORIES = ['Tất cả', 'Cổ tích', 'Truyền thuyết', 'Thần thoại', 'Ngụ ngôn'] as const;
export type BookCategory = typeof CATEGORIES[number];

export const VIETNAMESE_TALES: Tale[] = [
  {
    title: 'Sơn Tinh, Thủy Tinh',
    description: 'Truyền thuyết về cuộc chiến giữa Thần Núi và Thần Nước vì công chúa Mỵ Nương.',
    category: 'Truyền thuyết',
    origin: 'Dân gian Việt Nam',
    moral: 'Ca ngợi công lao dựng nước, giữ nước của cha ông và sức mạnh đoàn kết chống lại thiên tai.',
    content: [
      'Hùng Vương thứ mười tám có một người con gái tên là Mỵ Nương, nhan sắc tuyệt trần. Vua cha muốn kén cho nàng một người chồng xứng đáng.',
      'Một hôm, có hai chàng trai lạ đến xin cầu hôn. Một người là Sơn Tinh - Chúa tể vùng non cao. Gậy thần chỉ tới đâu, rừng núi mọc lên tới đó.',
      'Người kia là Thủy Tinh - Chúa tể vùng nước thẳm. Chàng vẫy tay gọi gió, hô mây gọi mưa. Ai cũng một mực đòi cưới Mỵ Nương.',
      'Vua Hùng ra điều kiện: "Ngày mai, ai đem sính lễ gồm một trăm ván cơm nếp, hai trăm nệp bánh chưng, voi chín ngà, gà chín cựa, ngựa chín hồng mao đến trước thì được rước dâu."',
      'Sơn Tinh mang lễ vật đến trước, rước Mỵ Nương về núi. Thủy Tinh đến sau, không cưới được vợ, tức giận dâng nước đánh Sơn Tinh.',
      'Sơn Tinh bốc đồi dời núi chặn dòng nước lũ. Nước dâng bao nhiêu, núi cao bấy nhiêu. Cuối cùng Thủy Tinh kiệt sức đành rút lui.'
    ]
  },
  {
    title: 'Sự Tích Trái Dưa Hấu',
    description: 'Bản lĩnh sinh tồn và ý chí vươn lên của Mai An Tiêm trên hoang đảo.',
    category: 'Cổ tích',
    origin: 'Dân gian Việt Nam',
    moral: 'Đề cao giá trị sức lao động, ý chí tự lực tự cường và trân trọng thành quả lao động của bản thân.',
    content: [
      'Mai An Tiêm là con nuôi của Hùng Vương, một kẻ tài trí hơn người. Chàng thường bảo: "Của biếu là của lo, của cho là của nợ, của mình làm ra mới là của bền vững."',
      'Câu nói lọt đến tai vua khiến vua tức giận, đày vợ chồng chàng ra hoang đảo khỉ ho cò gáy để xem chàng tự lập ra sao.',
      'Tại đây, An Tiêm nhặt được một hạt giống lạ màu đen từ một con chim gắp bay qua đánh rơi. Chàng ươm trồng và mọc ra loại quả lạ ruột đỏ, vỏ xanh.',
      'Khi thu hoạch, chàng lấy quả khắc tên mình rồi thả xuống biển để sóng đánh dạt vào bờ. Thương nhân nếm thử thấy ngọt mát, bèn đổi bao nhiêu là gạo lúa lấy dưa.',
      'Tin đồn về trái dưa hấu bay về cung. Vua nghẹn ngào biết An Tiêm không những không chết mà còn sống sung túc, bèn sai thuyền rước vợ chồng chàng về.'
    ]
  },
  {
    title: 'Thạch Sanh',
    description: 'Anh hùng dũng cảm diệt trăn tinh, bắn đại bàng cứu công chúa.',
    category: 'Cổ tích',
    origin: 'Dân gian Việt Nam',
    moral: 'Quy luật nhân quả "Ác giả ác báo, thiện giả thiện lai", lên án kẻ vong ân bội nghĩa, tham lam.',
    content: [
      'Ngày xưa ở quận Cao Bình, có hai vợ chồng hiếm muộn, cả đời kiếm sống cần mẫn bằng nghề kiếm củi đó đây.',
      'Mãi về già, Ngọc Hoàng thương tình đói rách mới sai thái tử xuống đầu thai. Người vợ thọ thai ba năm mới đẻ, không lâu sau hai vợ chồng lần lượt qua đời.',
      'Cậu bé con mồ côi ấy được đặt tên là Thạch Sanh, thui thủi trưởng thành bằng một túp lều lạnh lẽo dưới gốc đa cổ thụ.',
      'Gia tài duy nhất là một lưỡi búa bằng sắt đánh bóng cha truyền lại. Nhờ chăm chỉ vót nứa, chàng trở thành một thanh niên cường tráng, sức khỏe vô địch.',
      'Một hôm nọ, Lý Thông, một gã lái buôn xảo quyệt đi gánh hàng ngang qua. Thấy Thạch Sanh khuân một lúc ba xe củi bèn nảy sinh rắp tâm vụ lợi mưu địa.',
      'Hắn lân la gạ gẫm kết nghĩa anh em kim lan. Thạch Sanh thật thà nghe lọt tai, vội thu xếp tấc rách dọn về sống chung nhà với hai mẹ con Lý Thông ác nghiệt.',
      'Ở vùng này có miếu thờ con Chằn Tinh hung ác ngàn năm, mỗi năm dân làng phải khóc ròng nộp một mạng người cho nó ăn thịt để yên ổn làm ăn.',
      'Năm ấy xui xẻo đến lượt Lý Thông bị ghi tên trên sổ sinh tử. Hắn điếng hồn vã mồ hôi hột trót lọt, bèn lập miu chuốc rượu chua lừa Thạch Sanh đi canh miếu thay.',
      'Đêm khuya sương xuống rợn tóc gáy, Trăn Tinh khổng lồ phun phì phò hiện nguyên dạng lao vào định nuốt trọn ráo nát. Thạch Sanh bình tĩnh xoay vòng búa giáng mười nhát sấm sét vào ót.',
      'Chằn Tinh vỡ tan thây đứt đôi gục ngã, để lộ dưới bụng một bộ cung tên bằng vàng sáng rực rỡ. Chàng chặt cái đầu quái vật cùng cung tên bọc màn trở về thì trời hửng sáng.',
      'Lý Thông mừng rú gạt Thạch Sanh trốn đi ngay vì "giết phải rắn của Hoàng Gia". Được dịp, hắn bê thủ cấp yêu quái lên kinh thành láu cá dối gạt lĩnh thưởng, được Vua phong tước Quận công.',
      'Thạch Sanh không vương luyến quay lại túp lều bấy lâu. Một hôm ngước mặt, chàng thấy một Đại Bàng khổng lồ rụng lông lá xước xát đang quắp một cô gái trẻ qua ngọn núi.',
      'Chàng giương cung vàng uy dũng bắn thủng đôi cánh Đại Bàng rớt huyết đỏ thẫm. Lần theo dấu máu tanh rình trút lá, chàng leo xuống tận sâu lút mộc tinh của ác cầm.',
      'Cô gái ấy là Công chúa cành vàng ngọc diệp con vua Hùng, Lý Thông không phá được dây chuyền bèn mượn vây Thạch Sanh tuột ròng rọc xuống chém vỡ lồng đai dũng tuấn.',
      'Cứu được công chúa vút lên trời nhờ dòng ròng rọc, Lý Thông một mặt ra lệnh quân lính lăn đá lấp kín miệng hang hòng chôn sống chính ân nhân trọn đời cứu rỗi của mình.',
      'Dưới hang tăm tối hoang u thú thẳm, Thạch Sanh tự dùng chân mở cửa ngục tù nước đá, vô tình giải cứu được Thái tử con mẹ Long Vương bị giam giữ từ mười năm, và được đền mâm cỗ cung đình Thủy Tế.',
      'Long vương trịnh trọng biếu ngàn lượng vàng và hột ngọc ròng nhưng chàng khảng khái từ chối ngai vàng. Chàng chỉ xin gảy một khúc, dứt điểm cầm theo cây đàn thần ngọc lục bảo về chốn nhân gian.',
      'Ở trên hoàng thành cao gót, công chúa về cung thì bàng hoàng nín bặt vì uất ức đến câm luôn vĩnh cửu. Giữa lúc ấy rợn chớp, Lý Thông được thể âm mưu tâu vua ngụy xích vương quyền cướp ngôi.',
      'Lúc Thạch Sanh gảy đàn trong xó nhà gian, gieo những âm thanh oán hận như lời thanh kiếm xáy rách mây đen bay đến tận cửa Tử cung, đánh thức nụ cười công chúa và hé lộ mọi mưu ác thâm độc của lũ rắn độc Lý.',
      'Lý Thông và mẹ chạy tội lân về quê quán, chưa bước khỏi bệ đã bị sấm vang chớp lửa nện tơi bời hóa thành bọ hung bẩn thỉu rúc gậm dơ. Thạch Sanh được nhà Vua mớm tay gả nương tử Công chúa hiền thục ngự lãm vương triều mãi mãi.'
    ]
  },
  {
    title: 'Tấm Cám',
    description: 'Truyện cổ tích nổi tiếng về quy luật ở hiền gặp lành, thiện tất thắng ác.',
    category: 'Cổ tích',
    origin: 'Dân gian Việt Nam',
    moral: 'Người hiền lành, nhân hậu sẽ nhận được hạnh phúc. Kẻ độc ác, ghen tị sẽ gánh chịu hậu quả bi thảm.',
    content: [
      'Tấm mồ côi mẹ, phải sống với mụ dì ghẻ ác nghiệt và Cám. Tấm lam lũ làm lụng trong khi Cám lười biếng ham chơi, thường xuyên ăn hiếp Tấm.',
      'Nhờ ông Bụt hiện lên giúp đỡ từ chuyện con cá bống bị mẹ con Cám lừa ăn thịt, đến chuyện trộn gạo với thóc để bắt Tấm nhặt, Tấm đều vượt qua được khổ ải.',
      'Đến ngày hội làng, Tấm được chim sẻ nhặt thóc giúp, nhờ xương bống lấy được quần áo đẹp để đi dạ hội. Trên đường vội vã, nàng đánh rơi một chiếc giày thêu.',
      'Nhà vua bắt được giày, hạ lệnh ai ướm vừa sẽ lập làm Hoàng Hậu. Trong khi Cám ướm mãi không lọt, Tấm đặt chân vào lại vừa như in.',
      'Dì ghẻ ghen tức, nhiều lần hãm hại mạng sống Tấm. Nàng chết đi và liên tục hóa thân: thành chim vàng anh, cây xoan đào, khung cửi, và cuối cùng là quả thị thơm nức.',
      'Thị rơi bị bà lão, Tấm bước ra giúp việc nhà. Thế rồi nhà Vua đi ngang qua, nhận ra miếng trầu têm cánh phượng, đưa Tấm trở lại cung điện, sống ấm êm mãi mãi.'
    ]
  },
  {
    title: 'Sự Tích Cây Khế',
    description: 'Ăn một quả khế, trả một cục vàng. May túi ba gang, mang đi mà đựng.',
    category: 'Cổ tích',
    origin: 'Dân gian Việt Nam',
    moral: 'Phê phán thói tham lam vô độ, đề cao những người sống ngay thẳng, lương thiện, chịu thương chịu khó.',
    content: [
      'Hai anh em nhà kia cha mẹ mất sớm. Người anh tham lam chiếm hết gia tài bản quán, chỉ chia cho người em hiền lành một túp lều rách nát và một cây khế ngọt.',
      'Đến mùa, khế trĩu quả, có con chim lạ vô cùng to lớn bay tới ăn. Người em mếu máo xin chim đừng ăn, chim liền cất tiếng: "Ăn một quả, trả cục vàng, may túi ba gang, mang đi mà đựng."',
      'Hôm sau, chim cõng người em vượt ngàn trùng khơi ra đảo lấy vàng. Từ đó, người em trở nên giàu có, thường xuyên phân phát lúa gạo giúp đỡ kẻ nghèo hèn.',
      'Người anh biết chuyện, nảy lòng tham, bèn vác cả gia tài đến đổi lấy cây khế của người em. Chim lại đến ăn và cũng đưa người anh ra đảo.',
      'Sang đến đảo, người anh vơ vét nhét đầy ắp hai chiếc túi mười hai gang. Trên đường bay về qua biển lớn, vàng quá nặng khiến chim chao đảo, người anh trượt chân rơi thẳng xuống đáy đại dương.'
    ]
  },
  {
    title: 'Sọ Dừa',
    description: 'Ngoại hình xấu xí nhưng mang trong mình tấm lòng vàng và tài trí phi phàm.',
    category: 'Cổ tích',
    origin: 'Dân gian Việt Nam',
    moral: 'Vẻ đẹp đạo đức, tài năng bên trong quan trọng hơn hình thức bên ngoài. Người tốt sẽ nhận được phần thưởng xứng đáng.',
    content: [
      'Bà lão nghèo khát nước, uống vội vã từ cái sọ dừa trong gốc cây cổ thụ. Ai dè bà mang thai, đẻ ra một đứa bé tròn lăn lóc không tay không chân, gọi là Sọ Dừa.',
      'Cậu đến nhà phú ông xin đi chăn bò vất vả. Ở đây, ba cô con gái phú ông thay phiên đem cơm cho cậu. Hai cô chị hắt hủi đỏng đảnh, chỉ có cô út hiền lành tỏ vẻ thương cảm.',
      'Một lần, cô út nấp sau lùm cây, phát hiện Sọ Dừa thực chất là một thiếu niên khôi ngô tuấn tú biến thành đang thổi sáo gọi bò, nên đem lòng sắc cốt ghi tâm.',
      'Sọ Dừa nhờ mẹ đến hỏi cưới cô út, phú ông đòi vàng bạc lụa là châu báu mười xe mười gánh, không ngờ sang hôm sau sắm đủ mọi thứ.',
      'Sọ Dừa đỗ Trạng Nguyên, được vua cử đi sứ. Ở nhà hai cô chị ghen tị hãm hại lừa đẩy cô út xuống biển, nhưng nhờ dắt dao găm Sọ Dừa đưa, cô thoát chết trong bụng cá lớn, sum họp với chồng.'
    ]
  },
  {
    title: 'Thánh Gióng',
    description: 'Phù Đổng Thiên Vương - Biểu tượng xả thân cứu nước chấn động địa cầu.',
    category: 'Truyền thuyết',
    origin: 'Dân gian Việt Nam (Thời Hùng Vương)',
    moral: 'Tượng trưng cho tinh thần yêu nước, sức mạnh quật khởi bảo vệ đất nước thiêng liêng.',
    content: [
      'Ông bà lão hiếm muộn, một hôm bà ra đồng ướm thử chân vào vết chân khổng lồ, về nhà thụ thai sinh ra một bé trai. Lạ thay ba năm mà bé vẫn đặt đâu nằm đấy, không nói không cười.',
      'Khi giặc Ân giã tâm xâm lược, nhà vua tuyệt vọng sai sứ giả đi khắp nơi tìm người biệt tài cứu nước. Nghe tiếng rao, cậu bé vươn mình vụt cất giọng nhờ mẹ gọi sứ giả vào.',
      'Cậu rền rĩ xin vua đúc cho một con ngựa sắt, một nón sắt, một áo giáp sắt. Vừa dứt lời, cậu ăn khỏe mức kinh người, dân làng phải góp chung hết niêu gạo này đến nồi cơm khác.',
      'Gióng vươn vai phát thành tráng sĩ khổng lồ rực rỡ oai phong. Nhảy lên ngựa sắt, ngựa hí thét rống lên lửa thiêng, phi thẳng như chớp ra chiến trường.',
      'Roi sắt gãy vụn, Gióng nhổ lố tre đằng ngà lao loạn xạ vào bầy giặc, chôn vùi quân Ân dưới chân xác ngựa. Đánh xong, Gióng quay về hướng mẹ già bái vọng, rồi cởi giáp bay thẳng lên thiên đình từ đỉnh núi Sóc.'
    ]
  },
  {
    title: 'Chú Cuội Cung Trăng',
    description: 'Sự kỳ bí về bóng hình vĩnh cửu trên đĩa trăng rằm mỗi tháng Tám.',
    category: 'Cổ tích',
    origin: 'Dân gian Việt Nam',
    moral: 'Giải thích hiện tượng vết đen trên mặt trăng, nhắc nhở giữ trọn lời dặn dò, quý trọng những món quà phép màu.',
    content: [
      'Cuội đi rừng tình cờ phát hiện hổ mẹ đang nhai một thứ lá lạ mọc trong rừng sâu để mớm mổ, cứu sống bầy đàn hổ con đã nhắm mắt từ lâu.',
      'Chấp nhận hiểm nguy tính mạng, Cuội nhổ cây thuốc cổ thụ đa mang về trồng. Cây thuốc quý báu đã cứu sống bách tính muôn dân, bao gồm cả con gái phú ông đã qua đời, sau đó nàng chịu lấy Cuội.',
      'Nhưng rủi thay, Cây thiêng kị nước dơ, dặn vợ chồng phải gìn giữ. Vợ Cuội một lần đãng trí đi vệ sinh ngay dưới gốc cây. Rễ cây bỗng rùng rùng rung chuyển bứt tung mặt đất, chậm rãi quạt lá bay lên tầng mây.',
      'Cuội đi vắng về ngang tới nhà, thấy cây quý đang bay vụt bèn nhảy lên bám chặt lấy chùm rễ. Nhưng sức người không cản nổi, cứ thế Cuội bị Cây kéo bổng lên tận cung trăng lạnh giá.',
      'Từ đó tới nay, vào sáng thu mỗi đêm rằm tháng Tám, trẻ thơ ngước nhìn vầng mặt trăng sáng vằng vặc sẽ thấy bóng một dáng người nhỏ bé vẫn ôm khư khư gốc tình đa mồ côi, đó chính là chú Cuội.'
    ]
  },
  {
    title: 'Lạc Long Quân và Âu Cơ',
    description: 'Khai sinh dòng máu Tiên Rồng, cội nguồn của dân tộc Việt Nam.',
    category: 'Thần thoại',
    origin: 'Truyền thuyết thời Hồng Bàng',
    moral: 'Giải thích nguồn gốc cao quý của người Việt Nam (Con Rồng cháu Tiên) và tinh thần đoàn kết đồng bào.',
    content: [
      'Thuở xa xưa, vị thần rồng Lạc Long Quân, sức mạnh oai phong, đi lên cạn diệt nhiều yêu quái cứu dân. Ngài gặp nàng tiên Âu Cơ, nhan sắc tuyệt trần, cốt cách linh thiêng.',
      'Hai người kết duyên vợ chồng. Thời gian sau, Âu Cơ sinh ra một bọc trăm trứng, nở thành một trăm người con trai khỏe mạnh, tuấn tú.',
      'Sống với nhau lâu ngày, Lạc Long Quân nói: "Ta vốn nòi Rồng ở miền nước thẳm, nàng là dòng Tiên ở chốn non cao. Kẻ trên cạn người dưới nước, tập quán khác nhau, khó bề ăn ở cùng nhau lâu dài."',
      'Ngài chia năm mươi người con theo mẹ lên núi, năm mươi người con theo cha xuống biển, hẹn khi có việc thì giúp đỡ lẫn nhau.',
      'Người con trưởng theo mẹ lên vùng phong châu được tôn làm Hùng Vương, lập ra nước Văn Lang. Từ đó, người Việt Nam tự hào là dòng dõi "Con Rồng cháu Tiên".'
    ]
  },
  {
    title: 'Rùa và Thỏ',
    description: 'Cuộc thi chạy nổi tiếng chốn rừng xanh.',
    category: 'Ngụ ngôn',
    origin: 'Ngụ ngôn (lưu truyền)',
    moral: 'Chậm mà chắc chắn sẽ chiến thắng vẻ kiêu ngạo, chủ quan.',
    content: [
      'Vào một buổi sáng đầu xuân tinh mơ, Thỏ và Rùa gặp nhau trên đường đi kiếm ăn. Thỏ vốn nhanh nhẹn, khoe khoang chạy nhanh nhất rừng, tỏ vẻ coi thường Rùa chậm chạp.',
      'Rùa bình tĩnh khiêu chiến Thỏ thi chạy một vòng từ chân núi đến gốc cây sồi già. Thỏ cười ngất, đồng ý ngay.',
      'Sáng hôm đó, muôn loài đến xem đông đủ. Vừa có hiệu lệnh xuất phát, Thỏ phi như bay, chốc lát đã mất hút sau lũy tre, bỏ mặc Rùa cần mẫn từng bước nhỏ nhọc nhằn.',
      'Nghĩ đường còn dài, Rùa bò đến bao giờ mới tới nơi, Thỏ ta tạt ngang dọc hái hoa bắt bướm, nhởn nhơ ngủ một giấc ngon lành bên bờ suối.',
      'Tỉnh giấc, ngày đã ngả chiều. Thỏ cuống cuồng vắt chân lên cổ chạy thục mạng đến đích nhưng đã thấy Rùa mỉm cười đứng đợi sẵn từ lâu.'
    ]
  },
  {
    title: 'Trí Khôn Của Ta Đây',
    description: 'Cuộc gặp gỡ giữa Cọp, Trâu và Bác nông dân tài trí.',
    category: 'Cổ tích',
    origin: 'Dân gian Việt Nam',
    moral: 'Đề cao trí tuệ con người vượt lên trên sức mạnh hoang dã cơ bắp, giải thích nguồn gốc các sọc vằn trên lưng hổ.',
    content: [
      'Trên cánh đồng nọ, một con cọp đi ra khỏi rừng, thấy trâu thân hình vạm vỡ nhưng lại ngoan ngoãn cúi đầu kéo cày để một người nông dân nhỏ bé đánh đập.',
      'Cọp làm lạ bèn tiến tới hỏi trâu. Trâu đáp thật thà: "Người tuy nhỏ bé nhưng có trí khôn, chúa sơn lâm ạ!".',
      'Cọp tò mò, liền đi tìm người nông dân hỏi vay "Trí khôn". Người nông dân đáp: "Trí khôn tôi để ở nhà, muốn xem tôi sẽ về lấy. Nhưng sợ anh ăn mất trâu của tôi, để tôi trói anh vào gốc cây đã."',
      'Cọp tin lời cho trói chặt vào gốc cây. Trói xong, bác nông dân chất một đống rơm khô châm lửa đốt hơ, vừa đánh vừa hét lớn: "Trí khôn của ta đây, xem trí khôn của ta đây!".',
      'Lửa cháy nóng rát, cọp vùng vẫy bứt đứt dây thừng mang đầy thương tích bỏ chạy thục mạng. Từ đó trên lông cọp mãi có thêm những sọc vằn đen xám do vết cháy xém ngày ấy.'
    ]
  }
];
