import { Landmark } from '../types/landmark';

export const SAMPLE_LANDMARK_TEMPLATES: Landmark[] = [
  {
    id: 'vn-ha-long-bay',
    name: 'Vịnh Hạ Long',
    originalName: 'Ha Long Bay',
    tagline: 'Kỳ quan thiên nhiên thế giới giữa ngút ngàn đảo đá biếc và làn sóng ngọc bích',
    category: 'natural_wonder',
    categoryLabel: 'Kỳ quan Thiên nhiên',
    unescoStatus: 'Di sản Thiên nhiên Thế giới UNESCO (1994, 2000)',
    location: {
      province: 'Quảng Ninh',
      country: 'Việt Nam',
      address: 'Thành phố Hạ Long, Tỉnh Quảng Ninh, Việt Nam',
      coordinates: {
        lat: 20.9101,
        lng: 107.1839
      }
    },
    heroImage: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1800&q=80',
    theme: 'emerald',
    quickFacts: {
      bestSeason: 'Tháng 10 đến tháng 4 (Trời trong xanh, khí hậu mát dịu)',
      idealDuration: '2 ngày 1 đêm hoặc 3 ngày 2 đêm trên du thuyền',
      ticketPrice: '250.000đ - 290.000đ/tuyến tham quan trong ngày (chưa bao gồm vé tàu/du thuyền)',
      openingHours: '06:30 - 18:30 hàng ngày',
      suitableFor: 'Mọi lứa tuổi, gia đình, cặp đôi, du khách quốc tế',
      difficultyLevel: 'Dễ dàng',
      weatherNote: 'Tháng 7-8 có thể có bão nhiệt đới; mùa đông (tháng 12-2) se lạnh và có sương mờ thơ mộng.'
    },
    overview: 'Nằm ở bờ tây vịnh Bắc Bộ, Vịnh Hạ Long là một trong những kiệt tác địa chất kỳ vĩ nhất của tạo hóa trên hành tinh. Với diện tích khoảng 1.553 km² gồm 1.969 hòn đảo đá vôi lớn nhỏ nhấp nhô trên mặt nước màu ngọc bích, nơi đây mang đến khung cảnh huyền bí tựa như một bức tranh thủy mặc khổng lồ. Trải qua hơn 500 triệu năm kiến tạo địa chất và quá trình phong hóa karst ngập nước, Hạ Long sở hữu hệ thống hang động lộng lẫy cùng thảm thực vật phong phú, nơi rồng mẹ hạ phàm che chở đất nước trong huyền tích ngàn năm của người Việt.',
    pullQuote: 'Hạ Long không chỉ là cảnh quan, đó là nhịp thở vĩnh cửu của đá và nước qua hàng triệu năm lịch sử trái đất.',
    historyLore: 'Theo truyền thuyết dân gian, thuở mới lập nước, người Việt bị giặc ngoại xâm phương Bắc theo đường biển tràn vào tàn phá. Ngọc Hoàng đã sai Rồng mẹ cùng đàn Rồng con hạ giới giúp người Việt đánh giặc. Khi thuyền giặc ồ ạt tiến vào, đàn rồng liền phun ra vô số châu ngọc, biến thành muôn vàn đảo đá sừng sững như bức tường thành vững chãi khiến thuyền giặc đâm vào vỡ tan tành. Nơi Rồng mẹ đáp xuống được nhân dân đời đời gọi là Hạ Long.',
    culturalSignificance: 'Vịnh Hạ Long ghi dấu nhiều di chỉ khảo cổ học nổi tiếng như nền văn hóa Soi Nhụ (18.000 – 7.000 năm trước), văn hóa Cái Bèo (7.000 – 5.000 năm trước) và văn hóa Hạ Long (4.500 – 3.500 năm trước). Ngoài ra, đây còn là nơi cư ngụ đời đời của các làng chài cổ như Cửa Vạn, Vung Viêng với lối sống thủy cư độc đáo.',
    highlights: [
      {
        id: 'hl-1',
        title: 'Hang Sửng Sốt',
        description: 'Hang động karst rộng lớn và lộng lẫy bậc nhất vịnh, chia làm hai ngăn chính với hàng triệu khối thạch nhũ lung linh muôn hình vạn trạng.',
        tag: 'Địa chất kỳ vĩ',
        imageUrl: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1000&q=80'
      },
      {
        id: 'hl-2',
        title: 'Đảo Ti Tốp & Bãi tắm vầng trăng',
        description: 'Leo hơn 400 bậc đá lên đài quan sát đỉnh núi Ti Tốp để chiêm ngưỡng toàn cảnh vịnh 360 độ ngút ngàn, rồi đắm mình dưới làn nước xanh cát trắng.',
        tag: 'Tầm nhìn Panorama'
      },
      {
        id: 'hl-3',
        title: 'Chèo thuyền Kayak Hang Luồn',
        description: 'Tự tay khua mái chèo lướt qua vòm đá vôi ngập nước, tiến vào thung lũng nước kín được bao bọc bởi vách đá dựng đứng nơi đàn khỉ vàng sinh sống.',
        tag: 'Trải nghiệm thể thao'
      },
      {
        id: 'hl-4',
        title: 'Làng chài nổi Cửa Vạn',
        description: 'Từng được bình chọn là một trong những ngôi làng cổ kính đẹp nhất thế giới, lưu giữ nếp sống mộc mạc và câu hát giao duyên trên sóng nước.',
        tag: 'Văn hóa bản địa'
      }
    ],
    itinerary: [
      {
        id: 'day-1',
        dayNumber: 1,
        title: 'Ngày 1: Đón bình minh cảng quốc tế & Đêm trăng trên vịnh',
        summary: 'Check-in du thuyền, thưởng ngoạn cảnh quan đảo đá và ngắm hoàng hôn buông xuống vịnh di sản.',
        activities: [
          {
            time: '11:30 - 12:30',
            title: 'Lên du thuyền tại Cảng quốc tế Tuần Châu',
            description: 'Thưởng thức nước uống chào mừng, lắng nghe hướng dẫn an toàn hành trình và thưởng thức bữa trưa hải sản tươi sống khi tàu nhổ neo.',
            tip: 'Chuẩn bị máy ảnh sẵn sàng vì khung cảnh đảo Đinh Hương và Hòn Gà Chọi sẽ xuất hiện ngay sau bữa trưa.'
          },
          {
            time: '14:30 - 16:30',
            title: 'Khám phá Hang Sửng Sốt & Chèo Kayak Hang Luồn',
            description: 'Tản bộ qua các vòm hang thạch nhũ lấp lánh rồi chèo thuyền luồn dưới chân núi đá vào vịnh kín tĩnh lặng.'
          },
          {
            time: '17:30 - 19:00',
            title: 'Sunset Party & Lớp học nấu ăn truyền thống',
            description: 'Thư giãn trên boong tắm nắng với ly cocktail nhiệt đới ngắm hoàng hôn nhuộm đỏ chân trời đá vôi.'
          },
          {
            time: '20:30 - 22:00',
            title: 'Trải nghiệm câu mực đêm & Nghe nhạc acoustics',
            description: 'Thử tài câu mực cùng thủy thủ đoàn hoặc thảnh thơi trò chuyện ngắm vịnh đêm huyền ảo.'
          }
        ]
      },
      {
        id: 'day-2',
        dayNumber: 2,
        title: 'Ngày 2: Thái Cực Quyền đón sớm mai & Đảo Ti Tốp',
        summary: 'Tập Taichi đón mặt trời mọc, chinh phục đỉnh Ti Tốp và kết thúc hành trình.',
        activities: [
          {
            time: '06:15 - 07:00',
            title: 'Tập Thái Cực Quyền (Taichi) trên sundeck',
            description: 'Hít thở không khí trong lành nguyên sơ của biển sớm và khởi động năng lượng cho ngày mới.',
            tip: 'Mặt trời mọc từ khoảng 05:45 - 06:15 tùy mùa.'
          },
          {
            time: '07:30 - 09:00',
            title: 'Chinh phục đỉnh đảo Ti Tốp',
            description: 'Leo 450 bậc thang đá lên đỉnh ngắm toàn cảnh kỳ quan thế giới từ trên cao trước khi tắm biển.'
          },
          {
            time: '09:30 - 11:00',
            title: 'Làm thủ tục trả phòng & Thưởng thức buffet trưa',
            description: 'Tàu từ từ quay trở về bến Tuần Châu, du khách ăn trưa và lưu giữ những bức ảnh kỷ niệm cuối cùng.'
          }
        ]
      }
    ],
    gastronomy: [
      {
        id: 'food-1',
        name: 'Chả mực giã tay Hạ Long',
        description: 'Đặc sản trứ danh làm từ mực mai tươi sống nang dày, giã tay thủ công cho độ giòn dai sần sật, chiên vàng ươm ăn kèm xôi trắng hoặc bánh cuốn nóng.',
        recommendedPlaces: 'Chợ Hạ Long 1, Quán Chả Mực Thoan, Bánh cuốn chả mực bà Ngân'
      },
      {
        id: 'food-2',
        name: 'Sá sùng xào tỏi & Canh sá sùng lá lốt',
        description: 'Vị thuốc quý và sản vật đắt đỏ của vùng biển đảo Quan Lạn, vị ngọt thanh tự nhiên đậm đà không loại bột ngọt nào sánh bằng.',
        recommendedPlaces: 'Nhà hàng Cua Vàng Bãi Cháy, Hương Duyên Hòn Gai'
      },
      {
        id: 'food-3',
        name: 'Bún bề bề nóng hổi',
        description: 'Tô bún thơm nức với nước dùng nấu từ ghẹ và tôm biển, bên trên xếp đầy bề bề bóc nõn ngọt lịm, chả cá và rau thơm.',
        recommendedPlaces: 'Khu vực Cột 5 - Bến Đoan, Bún bề bề Huy Chiên'
      }
    ],
    practicalTips: [
      {
        id: 'tip-1',
        category: 'transport',
        title: 'Di chuyển từ Hà Nội đến Hạ Long',
        details: 'Cao tốc Hà Nội - Hải Phòng - Hạ Long chỉ mất khoảng 2 - 2.5 giờ đi ô tô limousine (giá khoảng 200.000đ - 260.000đ/vé).'
      },
      {
        id: 'tip-2',
        category: 'packing',
        title: 'Trang phục & Hành lý cần mang',
        details: 'Giày thể thao chống trơn trượt để leo bậc đá ở hang động và đảo; đồ bơi, kem chống nắng thân thiện môi trường; túi chống nước cho điện thoại khi chèo kayak.'
      },
      {
        id: 'tip-3',
        category: 'cost',
        title: 'Kinh phí dự tính',
        details: 'Tour du thuyền 2 ngày 1 đêm cao cấp từ 2.800.000đ - 4.500.000đ/người trọn gói ăn ở và vé tham quan. Du lịch tự túc trong ngày khoảng 800.000đ - 1.200.000đ/người.'
      },
      {
        id: 'tip-4',
        category: 'etiquette',
        title: 'Quy tắc bảo vệ di sản',
        details: 'Nghiêm cấm mang túi nilon và đồ nhựa dùng một lần xuống tàu tham quan vịnh; không chạm tay hoặc bẻ gãy thạch nhũ trong hang động karst.'
      }
    ],
    gallery: [
      {
        id: 'g-1',
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        caption: 'Mặt nước xanh ngọc bích phẳng lặng in bóng núi non trùng điệp.',
        author: 'Lưu trữ Di sản'
      },
      {
        id: 'g-2',
        url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
        caption: 'Hoàng hôn buông sắc tím hổ phách trên vòm trời vịnh di sản.',
        author: 'Nhiếp ảnh gia du lịch'
      },
      {
        id: 'g-3',
        url: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80',
        caption: 'Hệ thống thạch nhũ kỳ quan triệu năm trong lòng hang động.',
        author: 'Trung tâm Bảo tồn'
      }
    ],
    audioGuide: {
      title: 'Thuyết minh Di sản Vịnh Hạ Long',
      durationEstimateMinutes: 3,
      script: 'Chào mừng quý khách đến với Vịnh Hạ Long, kiệt tác địa chất kỳ vĩ được UNESCO hai lần vinh danh là Di sản Thiên nhiên Thế giới. Trải qua hơn 500 triệu năm biến đổi vỏ trái đất, gần hai ngàn hòn đảo đá vôi sừng sững vươn lên giữa làn sóng biếc. Theo huyền thoại ngàn đời, đàn Rồng nhà trời đã hạ phàm, nhả ngọc hóa thành thành lũy đá ngăn giặc, gìn giữ bờ cõi thái bình cho đất Việt. Hãy thả lỏng tâm hồn, lắng nghe tiếng gió vờn qua vòm hang thạch nhũ và cảm nhận nhịp thở bất tận của thiên nhiên.'
    },
    authorName: 'Ban Quản trị Danh Thắng Ký',
    updatedAt: '2026-09-28'
  },
  {
    id: 'vn-trang-an',
    name: 'Quần Thể Danh Thắng Tràng An',
    originalName: 'Trang An Scenic Landscape Complex',
    tagline: 'Vẻ đẹp thanh tịnh nơi địa linh nhân kiệt, di sản kép văn hóa và thiên nhiên thế giới',
    category: 'cultural_heritage',
    categoryLabel: 'Di sản Văn hóa & Thiên nhiên',
    unescoStatus: 'Di sản Thế giới Hỗn hợp UNESCO (2014) - Đầu tiên tại Đông Nam Á',
    location: {
      province: 'Ninh Bình',
      country: 'Việt Nam',
      address: 'Xã Ninh Xuân, Huyện Hoa Lư, Tỉnh Ninh Bình, Việt Nam',
      coordinates: {
        lat: 20.2506,
        lng: 105.9048
      }
    },
    heroImage: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1800&q=80',
    theme: 'parchment',
    quickFacts: {
      bestSeason: 'Tháng 1 - tháng 3 (Mùa xuân lễ hội) hoặc tháng 5 - tháng 6 (Mùa lúa chín vàng)',
      idealDuration: '1 - 2 ngày trọn vẹn',
      ticketPrice: '250.000đ/người lớn (bao gồm đò tham quan các tuyến hang)',
      openingHours: '07:00 - 17:00 các ngày trong tuần',
      suitableFor: 'Gia đình, người yêu thiên nhiên, nhiếp ảnh gia, du lịch tâm linh',
      difficultyLevel: 'Dễ dàng',
      weatherNote: 'Tháng 5 nắng đẹp lúa vàng óng ả; nên mang nón lá hoặc ô che nắng khi ngồi đò 3 tiếng.'
    },
    overview: 'Nằm cách thủ đô Hà Nội gần 100km về phía nam, Tràng An là một quần thể danh thắng kỳ vĩ bao gồm các khối núi đá vôi dạng tháp karst dựng đứng sừng sững bên những thung lũng nước ngập quanh năm. Được ví như "Vịnh Hạ Long trên cạn", Tràng An độc nhất vô nhị bởi sự giao thoa hài hòa giữa cảnh quan thiên nhiên trác tuyệt và các dấu tích khảo cổ học chứng minh con người tiền sử đã cư trú liên tục qua hơn 30.000 năm biến đổi khí hậu.',
    pullQuote: 'Tràng An là nơi đất trời giao hòa, nơi tiếng mái chèo khua nước đưa tâm hồn trở về với sự an tịnh nguyên sơ.',
    historyLore: 'Tràng An từng là thành lũy quân sự thiên tạo vô cùng hiểm yếu bảo vệ Cố đô Hoa Lư dưới triều đại Vua Đinh Tiên Hoàng và Vua Lê Đại Hành vào thế kỷ thứ X. Hệ thống núi non trùng điệp cùng các hang động ngập nước thông nhau tạo thành mạng lưới giao thông thủy bí mật, giúp quân dân Đại Cồ Việt giữ vững độc lập trước các đợt tấn công từ phương Bắc.',
    culturalSignificance: 'Di sản thế giới hỗn hợp duy nhất ở Đông Nam Á sở hữu các hang động khảo cổ như Hang Boi, Mái Đá Vàng chứa đựng chứng tích về sự thích ứng kiên cường của người tiền sử trước kỷ băng hà và sự biển tiến.',
    highlights: [
      {
        id: 'ta-1',
        title: 'Hành trình 3 tuyến đò xuyên thủy động',
        description: 'Ngồi đò nan mộc mạc do chính các cô thôn nữ chèo lái luồn lách qua các hang nước dài hàng trăm mét như Hang Đột, Hang Mây, Hang Sáng, Hang Tối.',
        tag: 'Khám phá hang ngầm'
      },
      {
        id: 'ta-2',
        title: 'Hành cung Vũ Lâm thời nhà Trần',
        description: 'Di tích lịch sử trầm mặc soi bóng xuống dòng sông Sào Khê, nơi các vị vua Trần từng tu hành và chuẩn bị lực lượng kháng chiến chống Nguyên Mông.',
        tag: 'Dấu ấn Hoàng gia'
      },
      {
        id: 'ta-3',
        title: 'Chinh phục Tuyệt Tịnh Cốc & Hang Múa',
        description: 'Vượt gần 500 bậc thang đá uốn lượn hình rồng trên đỉnh Ngọa Long để ngắm toàn cảnh thung lũng Tam Cốc lúa chín vàng rực rỡ.',
        tag: 'Góc nhìn siêu thực'
      }
    ],
    itinerary: [
      {
        id: 'ta-day-1',
        dayNumber: 1,
        title: 'Hành hương sông nước Tràng An & Cố đô Hoa Lư',
        summary: 'Đi đò tham quan tuyến 2 hoặc tuyến 3, thăm đền thờ Đinh - Lê cổ kính.',
        activities: [
          {
            time: '08:30 - 11:30',
            title: 'Trải nghiệm đò chèo Tràng An tuyến 2',
            description: 'Tuyến tham quan 4 hang động và 3 điểm tâm linh: Hang Lãng, Hang Vạng, Hang Thủy Linh và Đền Suối Tiên.',
            tip: 'Hãy chuẩn bị nón lá và nước khoáng; đò chở tối đa 4 người.'
          },
          {
            time: '12:00 - 13:30',
            title: 'Ăn trưa đặc sản cơm cháy thịt dê núi',
            description: 'Thưởng thức ẩm thực Ninh Bình tại các nhà hàng truyền thống dưới chân núi đá.'
          },
          {
            time: '14:30 - 16:30',
            title: 'Thăm Cố đô Hoa Lư ngàn năm',
            description: 'Dâng hương tưởng niệm vua Đinh Tiên Hoàng và vua Lê Đại Hành tại kinh đô đầu tiên của nhà nước phong kiến trung ương tập quyền.'
          },
          {
            time: '17:00 - 18:30',
            title: 'Hoàng hôn đỉnh Hang Múa',
            description: 'Check-in ngọn tháp đá cổ ngắm thung lũng khi nắng chiều nhuộm vàng đồng quê.'
          }
        ]
      }
    ],
    gastronomy: [
      {
        id: 'ta-f1',
        name: 'Thịt dê núi Ninh Bình',
        description: 'Dê được thả rông trên núi đá ăn nhiều thảo mộc nên thịt săn chắc, thơm ngọt, chế biến thành dê tái chanh, dê nướng tảng, dê xào lăn.',
        recommendedPlaces: 'Nhà hàng Chính Thư Hoa Lư, Hoàng Giang'
      },
      {
        id: 'ta-f2',
        name: 'Cơm cháy sốt tim cật & sốt dê',
        description: 'Cơm nếp hương phơi sấy khô chiên vàng giòn rụm chấm cùng nước sốt sánh mịn đậm đà thơm béo.',
        recommendedPlaces: 'Đặc sản mua làm quà tại bến thuyền Tràng An'
      },
      {
        id: 'ta-f3',
        name: 'Ốc núi Ninh Bình xào sả ớt',
        description: 'Loài ốc chỉ xuất hiện vào mùa mưa ẩm từ tháng 4 đến tháng 8, ăn lá thuốc rừng nên thịt có vị thuốc bắc giòn ngọt.',
        recommendedPlaces: 'Các quán ăn khu vực Tam Cốc - Bích Động'
      }
    ],
    practicalTips: [
      {
        id: 'ta-t1',
        category: 'transport',
        title: 'Phương tiện đi lại',
        details: 'Từ Hà Nội đi xe khách hoặc tàu hỏa đến TP Ninh Bình (chỉ 1.5 giờ), sau đó thuê xe máy hoặc taxi vào Tràng An khoảng 7km.'
      },
      {
        id: 'ta-t2',
        category: 'etiquette',
        title: 'Văn hóa khi đi đò và đền chùa',
        details: 'Nên mặc áo phao cứu sinh suốt chuyến đi đò; trang phục lịch sự kín đáo khi ghé thăm các đền đài tâm linh trong quần thể.'
      }
    ],
    gallery: [
      {
        id: 'ta-g1',
        url: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
        caption: 'Thuyền nan êm đềm lướt trên làn nước trong vắt nhìn thấy cả rong rêu đáy sông.',
        author: 'Nhiếp ảnh gia Di sản'
      }
    ],
    audioGuide: {
      title: 'Thuyết minh Quần thể Danh thắng Tràng An',
      durationEstimateMinutes: 3,
      script: 'Chào đón quý khách đến với Quần thể danh thắng Tràng An, di sản thế giới hỗn hợp đầu tiên của Đông Nam Á được UNESCO ghi danh vào năm 2014. Giữa thung lũng nước ngút ngàn, tiếng mái chèo khua nhẹ đưa ta vượt qua những hang ngầm kỳ vĩ ngập tràn thạch nhũ buông lơi. Nơi đây từng là căn cứ quân sự thiên tạo bảo bọc kinh thành Hoa Lư và là chốn tu hành thanh tịnh của các bậc tiền nhân thời Trần. Xin mời quý khách hít thở bầu không khí tĩnh mịch của non nước Ninh Bình.'
    },
    authorName: 'Ban Quản lý Di sản Tràng An',
    updatedAt: '2026-09-28'
  },
  {
    id: 'vn-phong-nha',
    name: 'Vườn Quốc Gia Phong Nha - Kẻ Bàng',
    originalName: 'Phong Nha - Ke Bang National Park',
    tagline: 'Vương quốc hang động kỳ vĩ bậc nhất hành tinh với hang Sơn Đoòng huyền thoại',
    category: 'natural_wonder',
    categoryLabel: 'Kỳ quan Thiên nhiên',
    unescoStatus: 'Di sản Thiên nhiên Thế giới UNESCO (2003, 2015)',
    location: {
      province: 'Quảng Bình',
      country: 'Việt Nam',
      address: 'Huyện Bố Trạch, Tỉnh Quảng Bình, Việt Nam',
      coordinates: {
        lat: 17.5902,
        lng: 106.2831
      }
    },
    heroImage: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1800&q=80',
    theme: 'stone',
    quickFacts: {
      bestSeason: 'Tháng 3 đến tháng 8 (Mùa khô, nhiệt độ mát mẻ trong hang, nước sông xanh ngọc)',
      idealDuration: '2 - 3 ngày',
      ticketPrice: '150.000đ - 250.000đ/vé vào hang (Phong Nha, Tiên Sơn, Động Thiên Đường)',
      openingHours: '07:30 - 16:30 hàng ngày',
      suitableFor: 'Người đam mê thám hiểm, mạo hiểm, trekking rừng nguyên sinh',
      difficultyLevel: 'Trung bình',
      weatherNote: 'Tháng 9 đến tháng 11 là mùa mưa lũ tại miền Trung, mực nước dâng cao có thể đóng cửa một số hang ướt.'
    },
    overview: 'Được mệnh danh là "Vương quốc hang động", Vườn quốc gia Phong Nha - Kẻ Bàng bảo tồn một trong hai vùng karst đá vôi cổ xưa và rộng lớn nhất châu Á với niên đại trên 400 triệu năm. Nơi đây ẩn chứa hơn 300 hang động lớn nhỏ cùng hệ thống sông ngầm dài kỷ lục, đặc biệt là hang Sơn Đoòng – hang động tự nhiên lớn nhất hành tinh đủ rộng để chứa cả một tòa nhà 40 tầng hay khu phố Manhattan bên trong.',
    pullQuote: 'Bước chân vào lòng đất Phong Nha là bước vào một chiều không gian khác, nơi thời gian ngưng đọng trong từng giọt nước nhũ đá.',
    historyLore: 'Tên gọi "Phong Nha" có nghĩa là "Gió lùa qua kẽ răng", bắt nguồn từ hình ảnh các mỏm thạch nhũ nhấp nhô nơi cửa hang đón từng làn gió thổi mát rượi. Nơi đây từng là nơi trú ẩn quân sự chiến lược trên tuyến đường Hồ Chí Minh huyền thoại trong những năm tháng kháng chiến.',
    culturalSignificance: 'Di sản lưu giữ những bản văn khắc chữ Chăm cổ kính trên vách đá từ thế kỷ thứ IX, cùng với sinh cảnh của nhiều loài động thực vật quý hiếm nằm trong Sách Đỏ quốc tế.',
    highlights: [
      {
        id: 'pn-1',
        title: 'Động Thiên Đường - Hoàng cung trong lòng đất',
        description: 'Hang khô dài nhất châu Á (31,4km) với cây cầu gỗ dài 1km dẫn lối qua những măng đá khổng lồ tựa tháp chùa hay cung điện nguy nga.',
        tag: 'Tuyệt tác thạch nhũ'
      },
      {
        id: 'pn-2',
        title: 'Thuyền rồng sông Son vào Động Phong Nha',
        description: 'Lướt trên dòng sông Son màu xanh ngọc bích rồi tắt máy thả trôi vào vòm hang tối mát lạnh nơi có bãi cát ngầm và hồ nước biếc.',
        tag: 'Sông ngầm kỳ vĩ'
      },
      {
        id: 'pn-3',
        title: 'Đu dây Zipline & Tắm bùn Hang Tối',
        description: 'Thử thách trượt zipline trên không trung qua dòng sông Chày rồi đi bộ khám phá lòng hang tối thui chứa lớp bùn khoáng thiên nhiên dẻo quánh.',
        tag: 'Mạo hiểm cảm giác mạnh'
      }
    ],
    itinerary: [
      {
        id: 'pn-day-1',
        dayNumber: 1,
        title: 'Ngày 1: Chinh phục Động Thiên Đường & Vui chơi Sông Chày Hang Tối',
        summary: 'Khám phá cung điện thạch nhũ khô buổi sáng và trải nghiệm thể thao nước buổi chiều.',
        activities: [
          {
            time: '08:30 - 11:30',
            title: 'Khám phá Động Thiên Đường',
            description: 'Đi xe điện xuyên tán rừng nhiệt đới rồi leo bộ lên cửa hang chiêm ngưỡng các kỳ quan nhũ đá.',
            tip: 'Bên trong hang nhiệt độ chỉ khoảng 18-22 độ C, hãy chuẩn bị áo khoác mỏng.'
          },
          {
            time: '13:30 - 16:30',
            title: 'Tắm bùn Hang Tối & Đu Zipline Sông Chày',
            description: 'Trải nghiệm ngâm mình trong bùn khoáng mát rượi không trọng lực và chèo kayak trên sông.'
          }
        ]
      }
    ],
    gastronomy: [
      {
        id: 'pn-f1',
        name: 'Gà đồi nướng chấm muối cheo',
        description: 'Gà thả đồi thịt dai ngọt nướng vàng trên than củi, chấm cùng muối cheo đặc sản giã từ lá lốt rừng, ớt xanh và muối hột thơm nồng.',
        recommendedPlaces: 'Khu du lịch Suối Nước Moọc, Nhà hàng Thu Huế Phong Nha'
      },
      {
        id: 'pn-f2',
        name: 'Cá chình khe suối nướng muối ớt',
        description: 'Cá suối tự nhiên bắt từ sông Son và sông Chày, thịt béo ngậy nướng thơm lừng.',
        recommendedPlaces: 'Quán cá khe ven sông Son'
      }
    ],
    practicalTips: [
      {
        id: 'pn-t1',
        category: 'packing',
        title: 'Giày dép và trang phục',
        details: 'Mang giày leo núi chống trơn trượt; trang phục thể thao nhanh khô nếu tham gia tour Hang Tối hay sông Chày.'
      }
    ],
    gallery: [
      {
        id: 'pn-g1',
        url: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80',
        caption: 'Ánh sáng tự nhiên rọi qua hố sụt khổng lồ trong vòm hang kỳ vĩ.',
        author: 'Đội Thám hiểm Hang động'
      }
    ],
    audioGuide: {
      title: 'Thuyết minh Di sản Vườn Quốc gia Phong Nha - Kẻ Bàng',
      durationEstimateMinutes: 3,
      script: 'Chào mừng quý khách đến với Phong Nha - Kẻ Bàng, vương quốc hang động huyền bí với niên đại hơn 400 triệu năm. Nơi đây lưu giữ bản hùng ca bất tận của tạo hóa với những hang động rộng lớn bậc nhất hành tinh, hệ thống sông ngầm ngoạn mục và những khối thạch nhũ lung linh tựa chốn bồng lai. Hãy hít thật sâu làn gió mát rượi từ lòng đất mẹ và bắt đầu chuyến du hành thám hiểm vào cõi kỳ quan kỳ bí.'
    },
    authorName: 'Ban Quản trị Vườn Quốc gia',
    updatedAt: '2026-09-28'
  },
  {
    id: 'vn-hoi-an',
    name: 'Đô Thị Cổ Hội An',
    originalName: 'Hoi An Ancient Town',
    tagline: 'Thương cảng quốc tế cổ tích bên dòng sông Hoài, nơi thời gian ngưng đọng trên từng mái ngói rêu phong',
    category: 'cultural_heritage',
    categoryLabel: 'Di sản Văn hóa Thế giới',
    unescoStatus: 'Di sản Văn hóa Thế giới UNESCO (1999)',
    location: {
      province: 'Quảng Nam',
      country: 'Việt Nam',
      address: 'Thành phố Hội An, Tỉnh Quảng Nam, Việt Nam',
      coordinates: {
        lat: 15.8801,
        lng: 108.338
      }
    },
    heroImage: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1800&q=80',
    theme: 'amber',
    quickFacts: {
      bestSeason: 'Tháng 2 đến tháng 7 (Thời tiết khô ráo, nắng vàng ấm áp)',
      idealDuration: '2 ngày 1 đêm',
      ticketPrice: '120.000đ/vé tham quan (bao gồm 5 di tích tự chọn trong phố cổ)',
      openingHours: 'Phố cổ mở cửa 24/7; các di tích nhà cổ mở cửa 07:00 - 21:00',
      suitableFor: 'Mọi lứa tuổi, cặp đôi, du khách yêu nhiếp ảnh và ẩm thực',
      difficultyLevel: 'Dễ dàng',
      weatherNote: 'Tháng 14 âm lịch hàng tháng có Đêm Phố Cổ tắt đèn điện, thắp sáng toàn bộ lồng đèn lụa lung linh.'
    },
    overview: 'Tọa lạc bên hạ lưu sông Thu Bồn, Hội An từng là một trong những thương cảng quốc tế sầm uất nhất Đông Nam Á từ thế kỷ XVI đến thế kỷ XIX, nơi các thương nhân Nhật Bản, Trung Hoa, Bồ Đào Nha, Hà Lan hội tụ giao thương tơ lụa và gốm sứ. Hội An may mắn bảo tồn gần như nguyên vẹn một quần thể di tích kiến trúc gồm hơn 1.000 ngôi nhà cổ tường vàng mái ngói âm dương, các hội quán người Hoa uy nghiêm, giếng cổ, nhà thờ tộc và cây Chùa Cầu biểu tượng.',
    pullQuote: 'Ở Hội An, mỗi bức tường vàng loang lổ rêu phong đều ẩn chứa một câu chuyện tình duyên và thương hồ của ba trăm năm trước.',
    historyLore: 'Vào thời kỳ hoàng kim, Hội An (tên gọi phương Tây là Faifo) là điểm dừng chân quan trọng trên Con đường Tơ lụa trên biển. Cây Chùa Cầu nổi tiếng được các thương nhân Nhật Bản xây dựng vào khoảng đầu thế kỷ XVII như thanh kiếm thần trấn yểm lưng con quái vật Cù (Namazu), giữ cho vùng đất không bị động đất, bão lũ.',
    culturalSignificance: 'Hội An là hình mẫu tiêu biểu hoàn hảo về một cảng thị truyền thống châu Á được gìn giữ mẫu mực, phản ánh sự giao thoa văn hóa đa sắc tộc sâu sắc trong nếp sống, tín ngưỡng và ẩm thực.',
    highlights: [
      {
        id: 'ha-1',
        title: 'Chùa Cầu (Lai Viễn Kiều)',
        description: 'Di tích biểu tượng quốc gia in trên tờ tiền 20.000đ, công trình kiến trúc gỗ mái ngói độc đáo bắc qua lạch nước nhỏ với đền thờ Bắc Đế Trấn Vũ.',
        tag: 'Biểu tượng lịch sử'
      },
      {
        id: 'ha-2',
        title: 'Thả hoa đăng trên sông Hoài khi đêm về',
        description: 'Bước lên chiếc thuyền gỗ nhỏ dập dềnh giữa muôn vàn ngọn hoa đăng giấy lấp lánh ánh nến gửi gắm ước nguyện bình an.',
        tag: 'Lãng mạn thi vị'
      },
      {
        id: 'ha-3',
        title: 'Nhà cổ Tấn Ký & Hội quán Phúc Kiến',
        description: 'Chiêm ngưỡng kiến trúc nhà ống truyền thống kết hợp tinh hoa Việt - Nhật - Hoa, nơi các hiện vật cổ và câu đối khảm xà cừ vẫn còn nguyên vẹn qua hàng thế kỷ.',
        tag: 'Kiến trúc cổ'
      }
    ],
    itinerary: [
      {
        id: 'ha-day-1',
        dayNumber: 1,
        title: 'Một ngày đắm chìm trong sắc vàng phố Hội',
        summary: 'Dạo bộ buổi sớm bình yên, thưởng thức cà phê ban công và ngắm đêm đèn lồng.',
        activities: [
          {
            time: '06:30 - 08:30',
            title: 'Đón bình minh không tiếng còi xe',
            description: 'Dạo bộ khi các con phố Trần Phú, Nguyễn Thái Học còn thưa vắng người, chụp ảnh cùng giàn hoa giấy rực rỡ.',
            tip: 'Ghé quán Bánh mì Phượng hoặc Bánh mì Madam Khánh ăn sáng cùng ly cà phê cốt dừa.'
          },
          {
            time: '09:00 - 11:30',
            title: 'Tham quan các di tích và may đo lấy ngay',
            description: 'Thăm Nhà cổ Tấn Ký, Hội quán Triều Châu và trải nghiệm may áo dài hoặc đồ lanh lấy nhanh trong 4 giờ.'
          },
          {
            time: '18:00 - 21:00',
            title: 'Ngắm phố cổ lên đèn & Xem show Ký Ức Hội An',
            description: 'Ăn cao lầu bên bờ sông Hoài rồi thưởng thức đại cảnh biểu diễn thực cảnh hoành tráng trên đảo Cồn Hến.'
          }
        ]
      }
    ],
    gastronomy: [
      {
        id: 'ha-f1',
        name: 'Cao lầu Hội An',
        description: 'Sợi mì màu vàng ngà làm từ gạo ngâm tro củi cù lao Chàm, luộc bằng nước giếng Bá Lễ ngàn năm, ăn cùng thịt xá xíu thơm ngậy, tóp mỡ giòn và rau sống Trà Quế.',
        recommendedPlaces: 'Cao lầu Thanh, Quán Không Gian Xanh'
      },
      {
        id: 'ha-f2',
        name: 'Bánh mì Hội An (Madam Khánh & Phượng)',
        description: 'Ổ bánh mì giòn tan được các chuyên gia ẩm thực thế giới ca ngợi là loại sandwich ngon nhất hành tinh với hơn 10 loại nhân đậm đà sốt gia truyền.',
        recommendedPlaces: 'Bánh mì Madam Khánh (Trần Cao Vân), Bánh mì Phượng (Phan Chu Trinh)'
      },
      {
        id: 'ha-f3',
        name: 'Nước Mót thảo mộc sả chanh',
        description: 'Thức uống thanh mát nấu từ kim ngân hoa, quế, la hán quả, chanh và sả, trang trí một cánh sen hồng thanh khiết.',
        recommendedPlaces: 'Quán Mót Hội An - 150 Trần Phú'
      }
    ],
    practicalTips: [
      {
        id: 'ha-t1',
        category: 'transport',
        title: 'Khung giờ cấm xe máy',
        details: 'Phố cổ cấm tất cả phương tiện cơ giới từ 09:00 - 11:00 và từ 15:00 - 21:30, hãy thuê xe đạp (khoảng 30.000đ/ngày) để dạo chơi thoải mái.'
      },
      {
        id: 'ha-t2',
        category: 'etiquette',
        title: 'Bảo vệ không gian di sản',
        details: 'Nói khẽ khi vào nhà cổ và hội quán tâm linh; không viết vẽ lên các bức tường vàng lịch sử.'
      }
    ],
    gallery: [
      {
        id: 'ha-g1',
        url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
        caption: 'Hàng ngàn chiếc đèn lồng lụa thắp sáng dòng sông Hoài thơ mộng khi màn đêm buông xuống.',
        author: 'Nhiếp ảnh gia Phố Cổ'
      }
    ],
    audioGuide: {
      title: 'Thuyết minh Đô thị Cổ Hội An',
      durationEstimateMinutes: 3,
      script: 'Chào đón quý khách đến với Đô thị cổ Hội An, bảo tàng sống về kiến trúc và lối sống đô thị thế kỷ XVII. Lắng nghe tiếng chuông gió khẽ rung trên mái ngói âm dương phủ đầy rêu phong, chiêm ngưỡng sắc vàng nồng ấm của những ngôi nhà cổ trường tồn qua bao cuộc đổi dời. Mỗi góc phố, mỗi con hẻm nhỏ uốn lượn nơi đây đều như một nhịp cầu đưa du khách trở về thời kỳ phồn hoa của thương cảng Faifo trứ danh.'
    },
    authorName: 'Trung tâm Quản lý Bảo tồn Di sản Hội An',
    updatedAt: '2026-09-28'
  },
  {
    id: 'vn-sapa-fansipan',
    name: 'Sa Pa & Đỉnh Fansipan',
    originalName: 'Sa Pa & Fansipan Peak',
    tagline: 'Nóc nhà Đông Dương giữa biển mây bồng bềnh và thung lũng ruộng bậc thang kỳ vĩ',
    category: 'mountain_eco',
    categoryLabel: 'Kỳ quan Miền Núi & Sinh Thái',
    unescoStatus: 'Ruộng bậc thang thung lũng Mường Hoa - Di tích Danh thắng Quốc gia đặc biệt',
    location: {
      province: 'Lào Cai',
      country: 'Việt Nam',
      address: 'Thị xã Sa Pa, Tỉnh Lào Cai, Việt Nam',
      coordinates: {
        lat: 22.3039,
        lng: 103.7749
      }
    },
    heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=80',
    theme: 'emerald',
    quickFacts: {
      bestSeason: 'Tháng 9 - 10 (Mùa lúa chín vàng) hoặc tháng 12 - 2 (Săn mây mùa đông & tuyết trắng)',
      idealDuration: '3 ngày 2 đêm',
      ticketPrice: '800.000đ - 850.000đ/vé cáp treo Fansipan khứ hồi',
      openingHours: 'Cáp treo hoạt động 08:00 - 17:30',
      suitableFor: 'Mọi lứa tuổi, người thích trekking, săn mây, khám phá văn hóa vùng cao',
      difficultyLevel: 'Trung bình',
      weatherNote: 'Thời tiết thay đổi 4 mùa trong 1 ngày; trên đỉnh Fansipan (3.143m) nhiệt độ thường thấp hơn thị xã 8-10 độ C.'
    },
    overview: 'Nằm ở độ cao 1.600m so với mực nước biển bên sườn dãy núi Hoàng Liên Sơn hùng vĩ, Sa Pa được mệnh danh là thành phố trong sương mờ xứ Bắc. Nơi đây sở hữu đỉnh Fansipan cao 3.143m - "Nóc nhà Đông Dương", bao bọc bởi thung lũng Mường Hoa với những dải ruộng bậc thang như nấc thang bắc lên mây trời, được kiến tạo qua hàng trăm năm mồ hôi công sức của đồng bào các dân tộc H’Mông, Dao đỏ, Tày, Giáy.',
    pullQuote: 'Ở Sa Pa, mây không chỉ bay trên trời, mây ùa vào tận cửa sổ và luồn qua từng ngón tay của người lữ khách.',
    historyLore: 'Vào đầu thế kỷ XX, người Pháp đã phát hiện ra vẻ đẹp khí hậu ôn đới mát mẻ của Sa Pa và xây dựng nơi đây thành một trạm nghỉ dưỡng trên núi với hàng trăm biệt thự cổ theo phong cách Alps châu Âu.',
    culturalSignificance: 'Bảo tồn đậm nét văn hóa các dân tộc thiểu số miền núi phía Bắc với các phiên chợ tình rộn rã tiếng khèn bè, tiếng sáo trúc và những bộ trang phục thổ cẩm thêu tay rực rỡ sắc màu.',
    highlights: [
      {
        id: 'sp-1',
        title: 'Chinh phục Cột cờ Đỉnh Fansipan 3.143m',
        description: 'Trải nghiệm tuyến cáp treo 3 dây đạt kỷ lục thế giới bay qua thung lũng mây để chạm tay vào chóp kim loại thiêng liêng nơi đỉnh cao Tổ quốc.',
        tag: 'Nóc nhà Đông Dương'
      },
      {
        id: 'sp-2',
        title: 'Thung lũng Ruộng bậc thang Mường Hoa',
        description: 'Trekking qua bản Lao Chải - Tả Van ngắm sóng lúa dập dờn như dải lụa vàng óng ả uốn lượn quanh sườn núi.',
        tag: 'Di sản nông nghiệp'
      },
      {
        id: 'sp-3',
        title: 'Tắm lá thuốc người Dao đỏ bản Tả Phìn',
        description: 'Ngâm mình trong bồn gỗ pơ-mu với nồi nước tắm thảo dược nấu từ hơn 30 vị thuốc rừng giúp xua tan mệt mỏi sau ngày dài leo núi.',
        tag: 'Liệu pháp truyền thống'
      }
    ],
    itinerary: [
      {
        id: 'sp-day-1',
        dayNumber: 1,
        title: 'Chạm tay vào Nóc nhà Đông Dương',
        summary: 'Đi tàu hỏa leo núi Mường Hoa, cáp treo lên đỉnh Fansipan và viếng quần thể tâm linh trên mây.',
        activities: [
          {
            time: '08:00 - 12:00',
            title: 'Chinh phục quần thể Fansipan Legend',
            description: 'Đi cáp treo vượt biển mây, chiêm bái Đại tượng Phật A Di Đà bằng đồng lớn nhất Việt Nam và check-in cột mốc 3.143m.',
            tip: 'Chuẩn bị áo khoác dày, găng tay và khăn quàng cổ vì gió trên đỉnh rất lạnh.'
          }
        ]
      }
    ],
    gastronomy: [
      {
        id: 'sp-f1',
        name: 'Lẩu cá hồi & Cá tầm Sa Pa',
        description: 'Cá hồi vân nuôi tại nguồn nước lạnh trên đèo Ô Quy Hồ, thịt đỏ tươi săn chắc nhúng lẩu nước dùng chua cay cùng cải mèo mọc tự nhiên.',
        recommendedPlaces: 'Nhà hàng Song Nhi Ô Quy Hồ, Xuân Viên Sa Pa'
      },
      {
        id: 'sp-f2',
        name: 'Thịt lợn cắp nách nướng than hoa',
        description: 'Giống lợn bản nuôi thả tự nhiên chỉ nặng 10-15kg, thịt nướng bì giòn tan chấm muối hạt dổi ớt tiêu rừng.',
        recommendedPlaces: 'Khu ẩm thực chợ đêm Sa Pa'
      }
    ],
    practicalTips: [
      {
        id: 'sp-t1',
        category: 'packing',
        title: 'Trang phục giữ ấm',
        details: 'Dù đi mùa hè cũng nên mang theo áo khoác gió mỏng vì đêm Sa Pa se lạnh; mùa đông cần áo phao đại hàn và giày đế bám tuyết.'
      }
    ],
    gallery: [
      {
        id: 'sp-g1',
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        caption: 'Biển mây trắng xóa bao phủ quần thể chùa cổ trên đỉnh Fansipan linh thiêng.',
        author: 'Trung tâm Du lịch Sa Pa'
      }
    ],
    audioGuide: {
      title: 'Thuyết minh Sa Pa & Đỉnh Fansipan',
      durationEstimateMinutes: 3,
      script: 'Chào mừng quý khách đến với Sa Pa và đỉnh Fansipan, nóc nhà của bán đảo Đông Dương với độ cao 3.143 mét. Giữa đại ngàn Hoàng Liên Sơn hùng vĩ, mây ngàn ôm ấp những thửa ruộng bậc thang kỳ vĩ được đồng bào các dân tộc kỳ công kiến tạo qua bao đời. Hãy hít căng lồng ngực bầu không khí trong lành mát lạnh của vùng cao, lắng nghe tiếng khèn gọi bạn và chiêm ngưỡng sự tráng lệ của giang sơn gấm vóc Việt Nam.'
    },
    authorName: 'Sở Văn hóa Thể thao và Du lịch Lào Cai',
    updatedAt: '2026-09-28'
  },
  {
    id: 'vn-hue-citadel',
    name: 'Quần Thể Di Tích Cố Đô Huế',
    originalName: 'Complex of Hue Monuments',
    tagline: 'Kinh đô hoàng gia triều Nguyễn bên dòng sông Hương thơ mộng, đỉnh cao kiến trúc cung đình',
    category: 'historic_monument',
    categoryLabel: 'Di tích Lịch sử Hoàng gia',
    unescoStatus: 'Di sản Văn hóa Thế giới UNESCO (1993) - Di sản đầu tiên của Việt Nam',
    location: {
      province: 'Thừa Thiên Huế',
      country: 'Việt Nam',
      address: 'Đường 23 Tháng 8, Phường Thuận Thành, Thành phố Huế, Tỉnh Thừa Thiên Huế',
      coordinates: {
        lat: 16.4698,
        lng: 107.5796
      }
    },
    heroImage: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1800&q=80',
    theme: 'imperial',
    quickFacts: {
      bestSeason: 'Tháng 1 đến tháng 4 (Tiết trời xuân mát mẻ, cây cỏ đâm chồi)',
      idealDuration: '2 - 3 ngày',
      ticketPrice: '200.000đ/vé Đại Nội; vé tuyến gộp các Lăng Tự Đức, Khải Định, Minh Mạng 420.000đ',
      openingHours: '07:00 - 17:30 (Mùa hè) / 07:30 - 17:00 (Mùa đông)',
      suitableFor: 'Du khách yêu lịch sử, kiến trúc cổ, nhiếp ảnh, văn hóa truyền thống',
      difficultyLevel: 'Dễ dàng',
      weatherNote: 'Tháng 9 đến tháng 11 có mưa dầm đặc trưng xứ Huế tạo nên nét trầm mặc sâu lắng.'
    },
    overview: 'Được xây dựng từ đầu thế kỷ XIX dưới triều đại nhà Nguyễn – triều đại phong kiến cuối cùng của Việt Nam, Quần thể di tích Cố đô Huế là kiệt tác kiến trúc cung đình quy mô lớn bậc nhất đất nước. Tọa lạc bên bờ sông Hương thơ mộng, quần thể bao gồm Kinh Thành, Hoàng Thành và Tử Cấm Thành, kết hợp hài hòa cùng các lăng tẩm hoàng gia hòa nhập tuyệt đối với cảnh quan thiên nhiên phong thủy núi Ngự Bình và dòng nước sông Hương.',
    pullQuote: 'Huế không ồn ào vội vã, nét đẹp của Cố đô như một bài thơ cổ trầm ngâm giữa rêu phong lịch sử.',
    historyLore: 'Vua Gia Long đã cùng các nhà địa lý phong thủy lựa chọn vị trí đất đai nơi đây theo thuyết dịch lý: lấy sông Hương làm minh đường, cồn Hến và cồn Dã Viên làm tả thanh long hữu bạch hổ, núi Ngự Bình làm tiền án che chắn mặt tiền kinh thành vững bền muôn thuở.',
    culturalSignificance: 'Nơi duy nhất ở Việt Nam bảo tồn trọn vẹn cả di sản vật thể (Hoàng cung, thành quách, lăng tẩm) và di sản phi vật thể nhân loại là Nhã nhạc Cung đình Huế cùng nghệ thuật ẩm thực hoàng gia cầu kỳ tinh tế.',
    highlights: [
      {
        id: 'hue-1',
        title: 'Ngọ Môn & Điện Thái Hòa',
        description: 'Cửa chính của Hoàng Thành Huế với lầu Ngũ Phụng tráng lệ, nơi diễn ra các đại lễ triều đình và lễ tuyên bố thoái vị của vua Bảo Đại năm 1945.',
        tag: 'Hoàng cung nguy nga'
      },
      {
        id: 'hue-2',
        title: 'Lăng Khải Định (Ứng Lăng)',
        description: 'Đỉnh cao của nghệ thuật ghép sành sứ và thủy tinh tinh xảo bậc nhất, kết hợp phong cách kiến trúc Á - Âu độc đáo.',
        tag: 'Kiến trúc đỉnh cao'
      },
      {
        id: 'hue-3',
        title: 'Đi thuyền rồng nghe Ca Huế trên sông Hương',
        description: 'Thả trôi theo dòng nước trong veo nghe những điệu hò man mác, điệu Nam ai Nam bình và thả hoa đăng ước nguyện trong đêm trăng.',
        tag: 'Di sản âm nhạc'
      }
    ],
    itinerary: [
      {
        id: 'hue-day-1',
        dayNumber: 1,
        title: 'Dấu ấn Hoàng gia Đại Nội & Lăng tẩm',
        summary: 'Tham quan Hoàng thành buổi sáng và lăng tẩm triều Nguyễn buổi chiều.',
        activities: [
          {
            time: '08:00 - 11:30',
            title: 'Khám phá Đại Nội Huế',
            description: 'Dạo bước qua Ngọ Môn, Điện Thái Hòa, Thế Miếu, Cung Diên Thọ và vườn Thiệu Phương.',
            tip: 'Nên thuê áo dài cổ phục Nhật Bình hoặc Ngũ Thân để chụp những bức hình kỷ niệm đậm chất hoàng tộc.'
          },
          {
            time: '14:00 - 16:30',
            title: 'Viếng Lăng Tự Đức & Lăng Khải Định',
            description: 'Chiêm ngưỡng hai công trình lăng tẩm mang phong cách đối lập: Lăng Tự Đức thơ mộng lãng mạn và Lăng Khải Định tinh xảo lộng lẫy.'
          }
        ]
      }
    ],
    gastronomy: [
      {
        id: 'hue-f1',
        name: 'Bún bò giò heo Cố đô Huế',
        description: 'Nước dùng đậm đà hương sả và mắm ruốc đặc trưng, sợi bún to tròn ăn cùng bắp bò hoa, chả cua giòn ngọt và tiết heo mềm mịn.',
        recommendedPlaces: 'Bún bò Mụ Rơi, Bún bò bà Tuyết (Nguyễn Công Trứ)'
      },
      {
        id: 'hue-f2',
        name: 'Bộ ba bánh Huế: Bèo - Nậm - Lọc',
        description: 'Những món bánh dân dã nhưng chế biến cầu kỳ: bánh lọc trong veo nhân tôm thịt đậm vị, bánh nậm mềm mịn gói lá dong, bánh bèo chén rắc tôm chấy vàng ruộm.',
        recommendedPlaces: 'Quán bánh Bà Đỏ, Hàng Me (Võ Thị Sáu)'
      },
      {
        id: 'hue-f3',
        name: 'Chè bột lọc bọc heo quay',
        description: 'Món chè độc nhất vô nhị chỉ có ở Huế với viên bột lọc dai dai bọc miếng thịt heo quay mằn mặn giòn giòn, nấu cùng nước đường gừng thơm ấm.',
        recommendedPlaces: 'Chè Mợ Tôn Đích trước công viên Thương Bạc'
      }
    ],
    practicalTips: [
      {
        id: 'hue-t1',
        category: 'etiquette',
        title: 'Trang phục khi vào điện thờ',
        details: 'Không mặc quần áo quá ngắn hoặc hở vai khi vào các khu vực cúng tế linh thiêng như Thế Miếu hay điện Thái Hòa.'
      }
    ],
    gallery: [
      {
        id: 'hue-g1',
        url: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80',
        caption: 'Mái ngói hoàng lưu ly rực rỡ dưới nắng chiều bên hồ sen Đại Nội.',
        author: 'Trung tâm Bảo tồn Cố đô Huế'
      }
    ],
    audioGuide: {
      title: 'Thuyết minh Quần thể Di tích Cố đô Huế',
      durationEstimateMinutes: 3,
      script: 'Kính chào quý khách đến với Quần thể di tích Cố đô Huế, kinh đô của nước Việt Nam dưới mười ba đời vua triều Nguyễn. Đứng trước Ngọ Môn sừng sững, lắng nghe tiếng chuông chùa Thiên Mụ ngân nga bên dòng sông Hương êm đềm, ta như nghe thấy tiếng vọng của một thời vàng son lộng lẫy. Hãy cùng bước qua những bậc thềm đá rêu phong, chiêm ngưỡng nghệ thuật kiến trúc đỉnh cao và hòa mình vào nét trầm tư sâu lắng của xứ Huế mộng mơ.'
    },
    authorName: 'Trung tâm Bảo tồn Di tích Cố đô Huế',
    updatedAt: '2026-09-28'
  }
];

// All pages deleted as requested by user - starting with a clean slate
export const DEFAULT_LANDMARKS: Landmark[] = [];
export const SAMPLE_LANDMARKS: Landmark[] = SAMPLE_LANDMARK_TEMPLATES;
