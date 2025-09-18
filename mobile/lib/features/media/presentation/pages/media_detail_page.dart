import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:tahya_misr_app/core/constants/app_theme.dart';

class MediaDetailPage extends StatefulWidget {
  final String newsId;

  const MediaDetailPage({
    super.key,
    required this.newsId,
  });

  @override
  State<MediaDetailPage> createState() => _MediaDetailPageState();
}

class _MediaDetailPageState extends State<MediaDetailPage> {
  final List<Map<String, dynamic>> achievementsData = [
    {
      'id': '1',
      'title': 'منتدي الطريق الى الجمهوريه الجديدة ',
      'image': 'assets/images/Achievements1.jpg',
      'description':
          'نصة حوارية تهدف الي الجمع بين شباب الجمهورية ، للمشاركة والتعبير عن آرائهم ، والخروج بتوصيات ومبادرات من خلال المناقشات الواسعة وتبادل الأفكار والخبرات ، ويأتي ذلك من خلال الجلسات وورش العمل بين الشباب والمتخصصين وقادة الفكر والشخصيات العامة في المجتمع ، أن المنتدى خلال نسخه الثلاثة المنفذه تم عرض العديد من المحاور النقاشية ، ',
      'notable': [
        'لإستراتيجية الوطنية لحقوق الإنسان',
        'الأمن القومي والتنمية السياسية',
        'التغير المناخي والبيئة المتكاملة و المستدامة',
        'دور الشباب و مؤسسات المجتمع المدنى فى تطبيق رؤية مصر 2030',
      ],
    },
    {
      'id': '2',
      'title': ' القمه الشبابية العربيه',
      'image': 'assets/images/Achievements2.jpg',
      'description':
          ' حاضنة رئيسية لتطلعات وطموح الشباب العربي من خلال دعمها وتشجيعها العديد من المبادرات والبرامج للارتقاء بدورهم ، وتستهدف تمكين الشباب العربي واشراكهم في العمل الشبابي والمجتمعي، وبناء وعيهم بأهم قضايا الوطن العربي المشتركة، وتنفيذ مبادرات شبابية لتعزيز الهوية العربية، ودعم الشباب من خلال إشراكهم في التنمية ، حيث تركز المبادرات والبرامج الموجهة للشباب العربي على رعاية طاقاتهم وتشجيعهم على الابتكار والتسلح بالمعرفة والعلم، وتعزيز دورهم الإيجابي في التنمية المستدامة بمجتمعاتهم.',
      'notable': [
        'تعزيز الهوية العربية',
        'دعم الابتكار والمعرفة',
        'التنمية المستدامة',
        'الشراكة مع جامعة الدول العربية',
      ],
    },
    {
      'id': '3',
      'title': 'المنتدي الوطني لبناء الوعي',
      'image': 'assets/images/Achievements3.jpg',
      'description':
          'تحت شعار « شباب واعى نحو ريادة المستقبل «منصة حوارية هدفها نشر وتعزيز الوعى لدى الشباب ومناقشة الموضوعات المعاصرة ورؤيتهم فى التعامل معها للمساهمه في تنفيذ المشروعات التنموية التى تدعم رؤية مصر 2030 وتتصدى لحروب الجيل الرابع .',
      'notable': [
        'نشر الوعي بين الشباب',
        'مناقشة القضايا المعاصرة',
        'دعم رؤية مصر 2030',
        'التصدي لحروب الجيل الرابع',
      ],
    },
    {
      'id': '4',
      'title': 'المبادرة الوطنية للبناء والتمكين',
      'image': 'assets/images/Achievements4.jpg',
      'description':
          'يهدف المشروع إلى تمكين الشباب من تطوير مهاراتهم وتعزيز قدراتهم، من خلال توفير بيئة داعمة تجمع بين التدريب العملي، العمل التطوعي، والإرشاد المهني. بما يتماشى مع الرؤية الوطنية لمبادرة "بداية"، ويعزز مساهمة الشباب في بناء مستقبل مستدام يعتمد على الابتكار والعمل الجماعي. ومن خلال هذا المشروع، سيتم تأهيل جيل من الشباب القادرين على مواجهة تحديات العصر والمساهمة في تحقيق التنمية الشاملة لوطنهم',
      'notable': [
        'التدريب العملي المتخصص',
        'العمل التطوعي المنظم',
        'الإرشاد المهني',
        'بناء القدرات الشبابية',
      ],
    },
    {
      'id': '5',
      'title': ' المبادرة الوطنية كنوز ال٢٧',
      'image': 'assets/images/Achievements5.jpg',
      'description':
          'يسعي فريق كنوز ال27 أن يكون رائد في نشر الوعي الأثري والتاريخي والتصدي للخرافات والشائعات من خلال حملته لإيصال مفهوم التاريخ الصحيح بشكل مبسط وشيق لأكبر فئة من المجتمع من خلال عمل زيارات ميدانية للأماكن أثرية وشرح أهم معالمها وتوفير بعض المحاضرات العلمية والثقافيه واقامة الندوات والتدريبات ويكون نطاق العمل في جميع محافظات الجمهورية',
      'notable': [
        'نشر الوعي الأثري والتاريخي',
        'التصدي للخرافات والشائعات',
        'زيارات ميدانية للأماكن الأثرية',
        'تغطية جميع محافظات الجمهورية',
      ],
    },
    {
      'id': '6',
      'title': 'المبادرة الوطنية رائدات مصر ',
      'image': 'assets/images/Achievements6.jpg',
      'description':
          'سعى من خلالها إلى دعم وتمكين المرأة المصرية في مختلف المجالات، ورفع وعيها بقدراتها وإمكاناتها لتكون عنصرًا فاعلًا في تنمية المجتمع.تأتي هذه المبادرة ، انطلاقًا من إيماننا العميق بأهمية دور المراه في قيادة التغيير الإيجابي، واستكمالًا للجهود الوطنية الرامية إلى تنمية وتوعية الأسرة المصرية ككل. ',
      'notable': [
        'برامج تدريبية متخصصة',
        'رفع الوعي بقدرات المرأة',
        'دعم دور المرأة في التنمية',
        'تمكين المرأة اقتصادياً ومجتمعياً',
        'مساحات حوارية تفاعلية',
      ],
    },
    {
      'id': '7',
      'title': 'المبادرة المجتمعيه وقايه تحيا مصر ',
      'image': 'assets/images/Achievements7.jpg',
      'description':
          'تتمحور حول التثقيف المجتمعي وتعزيز الوعي العام حول مجموعة من القضايا المحددة فضلا عن تشجيع الفرص الواعدة المتاحة وإحداث تغيير إيجابي يعود بالفائدة على المجتمع ،وخاصة تسليط الضوء على أهمية الكشف المبكر والوقاية من سرطان الثدي، وإبراز إنجازات الدولة في دعم صحة المرأة المصرية في إطار تنفيذ رؤية مصر 2030، كما يتناول دور بعض القطاعات في تقديم المساعدة الاجتماعية والاقتصادية والنفسية والصحية للنساء المصابات بالمرض',
      'notable': [
        'التثقيف الصحي المجتمعي',
        'الكشف المبكر لسرطان الثدي',
        'دعم صحة المرأة المصرية',
        'تقديم المساعدة الشاملة للنساء',
        'تنفيذ رؤية مصر 2030 الصحية',
      ],
    },
  ];

  @override
  Widget build(BuildContext context) {
    print(
      achievementsData.firstWhere((item) {
        return item['id'] == widget.newsId;
      }),
    );
    final achievementData = achievementsData.firstWhere(
      (item) => item['id'] == widget.newsId,
      orElse: () => {},
    );
    return CustomScrollView(
      slivers: [
        SliverAppBar(
          expandedHeight: 400,
          pinned: true,
          flexibleSpace: FlexibleSpaceBar(
            background: Image.asset(
              achievementData['image'],
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) => Container(
                color: Theme.of(context).colorScheme.surfaceContainerHighest,
                child: Icon(
                  Icons.image_not_supported,
                  size: 64,
                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                ),
              ),
            ),
          ),
        ),
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Title
                Text(
                  achievementData['title'],
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ).animate().fadeIn().slideY(begin: 0.3, end: 0),

                const SizedBox(height: 16),

                // Meta Info
                Row(
                  children: [
                    const SizedBox(),
                    const Spacer(),
                    IconButton(
                      icon: const Icon(Icons.share),
                      onPressed: () {
                        // TODO: Implement share functionality
                      },
                    ),
                    IconButton(
                      icon: const Icon(Icons.bookmark_outline),
                      onPressed: () {},
                    ),
                  ],
                ).animate().fadeIn(delay: 200.ms).slideX(begin: -0.3, end: 0),

                const SizedBox(height: 24),

                // Content
                Text(
                  achievementData['description'],
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                        height: 1.6,
                      ),
                ).animate().fadeIn(delay: 400.ms),
                const SizedBox(
                  height: 10,
                ),

                // Notable
                Text(
                  'أبرز المحاور:',
                  style: AppTheme.textTheme.titleLarge!.copyWith(
                    color: AppTheme.primaryColor,
                    fontWeight: FontWeight.w900,
                  ),
                ),
                const SizedBox(
                  height: 2,
                ),
                ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: (achievementData['notable'] as List).length,
                  itemBuilder: (context, index) {
                    return Padding(
                      padding: const EdgeInsets.symmetric(vertical: 4),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Icon(
                            Icons.check_circle,
                            color: AppTheme.primaryColor,
                            size: 20,
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              achievementData['notable'][index],
                              style: Theme.of(context)
                                  .textTheme
                                  .bodyMedium
                                  ?.copyWith(height: 1.5),
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ).animate().fadeIn(delay: 600.ms),
                const SizedBox(height: 32),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
