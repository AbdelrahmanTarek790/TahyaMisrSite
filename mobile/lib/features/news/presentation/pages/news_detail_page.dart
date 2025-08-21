import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';

class NewsDetailPage extends StatelessWidget {
  final String newsId;

  const NewsDetailPage({
    super.key,
    required this.newsId,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 250,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              background: Image.network(
                'https://picsum.photos/400/300?random=$newsId',
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) => Container(
                  color: Theme.of(context).colorScheme.surfaceVariant,
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
                    'عنوان الخبر رقم $newsId',
                    style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ).animate().fadeIn().slideY(begin: 0.3, end: 0),
                  
                  const SizedBox(height: 16),
                  
                  // Meta Info
                  Row(
                    children: [
                      CircleAvatar(
                        radius: 20,
                        backgroundColor: Theme.of(context).colorScheme.primary,
                        child: Icon(
                          Icons.person,
                          color: Theme.of(context).colorScheme.onPrimary,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'كاتب الخبر',
                              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            Text(
                              'منذ ساعتين',
                              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                color: Theme.of(context).colorScheme.onSurface.withOpacity(0.6),
                              ),
                            ),
                          ],
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.share),
                        onPressed: () {
                          // TODO: Implement share functionality
                        },
                      ),
                      IconButton(
                        icon: const Icon(Icons.bookmark_outline),
                        onPressed: () {
                          // TODO: Implement bookmark functionality
                        },
                      ),
                    ],
                  ).animate().fadeIn(delay: 200.ms).slideX(begin: -0.3, end: 0),
                  
                  const SizedBox(height: 24),
                  
                  // Content
                  Text(
                    _getDummyContent(),
                    style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                      height: 1.6,
                    ),
                  ).animate().fadeIn(delay: 400.ms),
                  
                  const SizedBox(height: 32),
                  
                  // Tags
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: ['أخبار', 'طلاب', 'مصر', 'تعليم'].map((tag) {
                      return Chip(
                        label: Text(tag),
                        backgroundColor: Theme.of(context).colorScheme.secondaryContainer,
                        labelStyle: TextStyle(
                          color: Theme.of(context).colorScheme.onSecondaryContainer,
                        ),
                      );
                    }).toList(),
                  ).animate().fadeIn(delay: 600.ms).slideY(begin: 0.3, end: 0),
                  
                  const SizedBox(height: 32),
                  
                  // Related News Section
                  Text(
                    'أخبار ذات صلة',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ).animate().fadeIn(delay: 800.ms),
                  
                  const SizedBox(height: 16),
                  
                  // Related News List
                  ListView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: 3,
                    itemBuilder: (context, index) {
                      return ListTile(
                        leading: ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: Image.network(
                            'https://picsum.photos/60/60?random=${index + 100}',
                            width: 60,
                            height: 60,
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) => Container(
                              width: 60,
                              height: 60,
                              color: Theme.of(context).colorScheme.surfaceVariant,
                              child: Icon(
                                Icons.image_not_supported,
                                color: Theme.of(context).colorScheme.onSurfaceVariant,
                              ),
                            ),
                          ),
                        ),
                        title: Text(
                          'خبر ذو صلة رقم ${index + 1}',
                          style: Theme.of(context).textTheme.titleMedium,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                        subtitle: Text(
                          'منذ ${index + 1} ساعات',
                          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: Theme.of(context).colorScheme.onSurface.withOpacity(0.6),
                          ),
                        ),
                        onTap: () {
                          // TODO: Navigate to related news
                        },
                      ).animate().fadeIn(delay: (1000 + index * 200).ms).slideX(begin: 0.3, end: 0);
                    },
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  String _getDummyContent() {
    return '''
في إطار جهود اتحاد طلاب مصر المستمرة لخدمة الطلاب والطالبات في جميع أنحاء الجمهورية، تم الإعلان عن مجموعة جديدة من البرامج والفعاليات التي تهدف إلى تطوير قدرات الطلاب وإثراء تجربتهم الجامعية.

تتضمن هذه البرامج ورش عمل متخصصة في مختلف المجالات، بالإضافة إلى فعاليات ثقافية ورياضية متنوعة. كما يتم التركيز على برامج التدريب المهني والتطوير الشخصي للطلاب.

من جانبه، أكد رئيس الاتحاد على أهمية هذه المبادرات في بناء جيل قادر على مواجهة تحديات المستقبل، وأشار إلى أن الاتحاد يسعى دائماً لتقديم أفضل الخدمات للطلاب.

يذكر أن التسجيل في هذه البرامج متاح الآن لجميع الطلاب من خلال موقع الاتحاد الإلكتروني، ويتم اختيار المشاركين وفقاً لمعايير محددة تضمن الاستفادة القصوى من هذه الفرص.

كما أعلن الاتحاد عن تخصيص مكافآت مالية للطلاب المتميزين في هذه البرامج، بهدف تشجيع المشاركة الفعالة والإبداع في الأنشطة المختلفة.
''';
  }
}