import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';

import '../../../../gen_l10n/app_localizations.dart';
import '../../domain/entities/media.dart';
import '../bloc/media_bloc.dart';
import '../bloc/media_state.dart';
import '../bloc/media_event.dart';

class MediaGalleryPage extends StatefulWidget {
  const MediaGalleryPage({super.key});

  @override
  State<MediaGalleryPage> createState() => _MediaGalleryPageState();
}

class _MediaGalleryPageState extends State<MediaGalleryPage> {
  late MediaBloc _mediaBloc;

  @override
  void initState() {
    super.initState();
  /*  _mediaBloc = GetIt.instance<MediaBloc>();
    _mediaBloc.add(const MediaEvent.getMedia());*/
  }
  final List<Map<String, dynamic>> achievementsData = [
    {
      'id': '1',
      'title': 'منتدي الطريق الى الجمهوريه الجديدة ',
      'image': 'assets/images/Achievements1.jpg',
      'description': 'نصة حوارية تهدف الي الجمع بين شباب الجمهورية ، للمشاركة والتعبير عن آرائهم ، والخروج بتوصيات ومبادرات من خلال المناقشات الواسعة وتبادل الأفكار والخبرات ، ويأتي ذلك من خلال الجلسات وورش العمل بين الشباب والمتخصصين وقادة الفكر والشخصيات العامة في المجتمع ، أن المنتدى خلال نسخه الثلاثة المنفذه تم عرض العديد من المحاور النقاشية ، ',
    },
    {
      'id': '2',
      'title': ' القمه الشبابية العربيه',
      'image': 'assets/images/Achievements2.jpg',
      'description' : ' حاضنة رئيسية لتطلعات وطموح الشباب العربي من خلال دعمها وتشجيعها العديد من المبادرات والبرامج للارتقاء بدورهم ، وتستهدف تمكين الشباب العربي واشراكهم في العمل الشبابي والمجتمعي، وبناء وعيهم بأهم قضايا الوطن العربي المشتركة، وتنفيذ مبادرات شبابية لتعزيز الهوية العربية، ودعم الشباب من خلال إشراكهم في التنمية ، حيث تركز المبادرات والبرامج الموجهة للشباب العربي على رعاية طاقاتهم وتشجيعهم على الابتكار والتسلح بالمعرفة والعلم، وتعزيز دورهم الإيجابي في التنمية المستدامة بمجتمعاتهم.'
    },
    {
      'id': '3',
      'title': 'المنتدي الوطني لبناء الوعي',
      'image': 'assets/images/Achievements3.jpg',
      'description' : 'تحت شعار « شباب واعى نحو ريادة المستقبل «منصة حوارية هدفها نشر وتعزيز الوعى لدى الشباب ومناقشة الموضوعات المعاصرة ورؤيتهم فى التعامل معها للمساهمه في تنفيذ المشروعات التنموية التى تدعم رؤية مصر 2030 وتتصدى لحروب الجيل الرابع .',
    },
    {
      'id': '4',
      'title': 'المبادرة الوطنية للبناء والتمكين',
      'image': 'assets/images/Achievements4.jpg',
      'description' : 'يهدف المشروع إلى تمكين الشباب من تطوير مهاراتهم وتعزيز قدراتهم، من خلال توفير بيئة داعمة تجمع بين التدريب العملي، العمل التطوعي، والإرشاد المهني. بما يتماشى مع الرؤية الوطنية لمبادرة "بداية"، ويعزز مساهمة الشباب في بناء مستقبل مستدام يعتمد على الابتكار والعمل الجماعي. ومن خلال هذا المشروع، سيتم تأهيل جيل من الشباب القادرين على مواجهة تحديات العصر والمساهمة في تحقيق التنمية الشاملة لوطنهم'
    },
    {
      'id': '5',
      'title': ' المبادرة الوطنية كنوز ال٢٧',
      'image': 'assets/images/Achievements5.jpg',
      'description' : 'يسعي فريق كنوز ال27 أن يكون رائد في نشر الوعي الأثري والتاريخي والتصدي للخرافات والشائعات من خلال حملته لإيصال مفهوم التاريخ الصحيح بشكل مبسط وشيق لأكبر فئة من المجتمع من خلال عمل زيارات ميدانية للأماكن أثرية وشرح أهم معالمها وتوفير بعض المحاضرات العلمية والثقافيه واقامة الندوات والتدريبات ويكون نطاق العمل في جميع محافظات الجمهورية',
    },
    {
      'id': '6',
      'title': 'المبادرة الوطنية رائدات مصر ',
      'image': 'assets/images/Achievements6.jpg',
      'description' : 'سعى من خلالها إلى دعم وتمكين المرأة المصرية في مختلف المجالات، ورفع وعيها بقدراتها وإمكاناتها لتكون عنصرًا فاعلًا في تنمية المجتمع.تأتي هذه المبادرة ، انطلاقًا من إيماننا العميق بأهمية دور المراه في قيادة التغيير الإيجابي، واستكمالًا للجهود الوطنية الرامية إلى تنمية وتوعية الأسرة المصرية ككل. ',
    },
    {
      'id': '7',
      'title': 'المبادرة المجتمعيه وقايه تحيا مصر ',
      'image': 'assets/images/Achievements7.jpg',
      'description' : 'تتمحور حول التثقيف المجتمعي وتعزيز الوعي العام حول مجموعة من القضايا المحددة فضلا عن تشجيع الفرص الواعدة المتاحة وإحداث تغيير إيجابي يعود بالفائدة على المجتمع ،وخاصة تسليط الضوء على أهمية الكشف المبكر والوقاية من سرطان الثدي، وإبراز إنجازات الدولة في دعم صحة المرأة المصرية في إطار تنفيذ رؤية مصر 2030، كما يتناول دور بعض القطاعات في تقديم المساعدة الاجتماعية والاقتصادية والنفسية والصحية للنساء المصابات بالمرض',
    },
  ];
  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;    return Scaffold(
      appBar: AppBar(
        title:  Text(l10n.recentMedia),
        backgroundColor: Theme.of(context).colorScheme.surface,
        elevation: 0,
      ),
      body: ListView.builder(
        itemCount: achievementsData.length,
        itemBuilder: (context, index) {
          final achievement = achievementsData[index];
          return Card(
            margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: InkWell(
              onTap: () {
                context.push('/media/detail/${achievement['id']}');
              },
              borderRadius: BorderRadius.circular(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                    ClipRRect(
                      borderRadius: const BorderRadius.only(
                        topLeft: Radius.circular(16),
                        topRight: Radius.circular(16),
                      ),
                      child: AspectRatio(
                        aspectRatio: 16 / 9,
                        child: Image.asset(
                          achievement['image'] ,
                          width: double.infinity,
                          fit: BoxFit.fill,
                          errorBuilder: (context, error, stackTrace) => Container(
                            color: Theme.of(context).colorScheme.surfaceContainerHighest,
                            child: Icon(
                              Icons.image_not_supported,
                              size: 48,
                              color: Theme.of(context).colorScheme.onSurfaceVariant,
                            ),
                          ),
                        ),
                      ),
                    ),
                  Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          achievement['title'],
                          style: Theme.of(context).textTheme.titleLarge?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          achievement['description'],
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            color: Theme.of(context)
                                .colorScheme
                                .onSurface
                                .withValues(alpha: 0.7),
                          ),
                          maxLines: 3,
                          overflow: TextOverflow.ellipsis,
                        ),
                        Row(
                          children: [
                            const SizedBox(),
                            const Spacer(),
                            TextButton(
                              onPressed: () {
                                context.push('/media/detail/${achievement['id']}');
                              },
                              child: Text(
                                l10n.readMore,
                                style: Theme.of(context)
                                    .textTheme
                                    .bodySmall
                                    ?.copyWith(
                                  color:
                                  Theme.of(context).colorScheme.primary,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ),
                          ],
                        )
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ).animate().fadeIn(delay: (index * 100).ms).slideY(begin: 0.3, end: 0);
        },
      )
    );
  }
}

/*
BlocProvider.value(
        value: _mediaBloc,
        child: BlocBuilder<MediaBloc, MediaState>(
          builder: (context, state) {
            return state.when(
              initial: () => const Center(
                child: CircularProgressIndicator(),
              ),
              loading: () => const Center(
                child: CircularProgressIndicator(),
              ),
              loaded: (mediaList) => mediaList.isEmpty
                  ? const Center(
                      child: Text('لا توجد انجازات و مشروعات متاحة'),
                    )
                  : RefreshIndicator(
                      onRefresh: () async {
                        _mediaBloc.add(const MediaEvent.refreshMedia());
                      },
                      child: Padding(
                        padding: const EdgeInsets.all(8),
                        child: GridView.builder(
                          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 2,
                            crossAxisSpacing: 8,
                            mainAxisSpacing: 8,
                          ),
                          itemCount: mediaList.length,
                          itemBuilder: (context, index) {
                            final media = mediaList[index];
                            return _MediaCard(media: media)
                                .animate(delay: (index * 50).ms)
                                .scale(begin: const Offset(0.8, 0.8))
                                .fadeIn();
                          },
                        ),
                      ),
                    ),
            );
          },
        ),
      )
 */