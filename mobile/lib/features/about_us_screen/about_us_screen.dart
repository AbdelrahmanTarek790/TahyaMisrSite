import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:tahya_misr_app/core/constants/app_theme.dart';

import '../../gen_l10n/app_localizations.dart';
import '../home/presentation/widgets/custom_icon_widget.dart';
import './widgets/goals_card_widget.dart';
import './widgets/milestones_timeline_widget.dart';
import './widgets/mission_card_widget.dart';
import './widgets/vision_card_widget.dart';
import './widgets/working_areas_widget.dart';
import './widgets/youth_priorities_widget.dart';

class AboutUsScreen extends StatefulWidget {
  const AboutUsScreen({super.key});

  @override
  State<AboutUsScreen> createState() => _AboutUsScreenState();
}

class _AboutUsScreenState extends State<AboutUsScreen>
    with TickerProviderStateMixin {
  late TabController _tabController;
  final ScrollController _scrollController = ScrollController();
  bool _showBackToTop = false;


  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _scrollController.addListener(_scrollListener);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _scrollController.removeListener(_scrollListener);
    _scrollController.dispose();
    super.dispose();
  }

  void _scrollListener() {
    if (_scrollController.offset >= 200) {
      if (!_showBackToTop) {
        setState(() {
          _showBackToTop = true;
        });
      }
    } else {
      if (_showBackToTop) {
        setState(() {
          _showBackToTop = false;
        });
      }
    }
  }

  void _scrollToTop() {
    _scrollController.animateTo(
      0,
      duration: const Duration(milliseconds: 500),
      curve: Curves.easeInOut,
    );
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: SafeArea(
        child: Column(
          children: [
            _buildHeader(),
            _buildTabBar(),
            Expanded(
              child: TabBarView(
                controller: _tabController,
                children: [
                  _buildAboutTab(),
                  _buildPrioritiesTab(),
                  _buildMilestonesTab(),
                ],
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: _showBackToTop
          ? FloatingActionButton(
              onPressed: _scrollToTop,
              backgroundColor: AppTheme.primaryColor,
              child: const CustomIconWidget(
                iconName: 'keyboard_arrow_up',
                color: AppTheme.background,
                size: 24,
              ),
            )
          : null,
    );
  }

  Widget _buildHeader() {
    final l10n = AppLocalizations.of(context);
    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topRight,
          end: Alignment.bottomLeft,
          colors: [
            Theme.of(context).colorScheme.primary,
            Theme.of(context).colorScheme.primary.withValues(alpha: 0.8),
          ],
        ),
      ),
      child: Column(
        children: [
          const SizedBox(
            height: 10,
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 4),
            child: Container(
              height: 200,
              width: double.infinity,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.2),
                    blurRadius: 10,
                    offset: const Offset(0, 5),
                  ),
                ],
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(16),
                child:  Image.asset(
                  'assets/images/background.jpg',
                  width: double.infinity,
                  height: 20,
                  fit: BoxFit.cover,
                ),
              ),
            ),
          ),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.onPrimary
                  .withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  l10n!.appTitle,
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: Theme.of(context).colorScheme.onPrimary,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTabBar() {
    final l10n = AppLocalizations.of(context)!;
    return Container(
      color:Theme.of(context).colorScheme.surface,
      child: TabBar(
        controller: _tabController,
        labelColor:Theme.of(context).colorScheme.primary,
        unselectedLabelColor:
           Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.6),
        indicatorColor:Theme.of(context).colorScheme.secondary,
        indicatorWeight: 3,
        labelStyle:Theme.of(context).textTheme.titleSmall?.copyWith(
          fontWeight: FontWeight.bold,
        ),
        unselectedLabelStyle:Theme.of(context).textTheme.titleSmall,
        tabs: [
          Tab(text: l10n.aboutTheUnion),
          Tab(text: l10n.activitiesTitle),
          Tab(text: l10n.unionJourneyTitle),
        ],
      ),
    );
  }

  Widget _buildAboutTab() {
    return RefreshIndicator(
      onRefresh: () async {
        await Future.delayed(const Duration(seconds: 1));
        HapticFeedback.lightImpact();
      },
      color:Theme.of(context).colorScheme.secondary,
      child: SingleChildScrollView(
        controller: _scrollController,
        physics: const AlwaysScrollableScrollPhysics(),
        child: const Column(
          spacing: 15,
          mainAxisSize: MainAxisSize.max,
          children: [
            SizedBox(height: 20),
            VisionCardWidget(),
            SizedBox(height: 20),
            MissionCardWidget(),
            SizedBox(height: 20),
            GoalsCardWidget(),
            SizedBox(height: 20),
            WorkingAreasWidget(),
            SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildPrioritiesTab() {
    return RefreshIndicator(
      onRefresh: () async {
        await Future.delayed(const Duration(seconds: 1));
        HapticFeedback.lightImpact();
      },
      color:Theme.of(context).colorScheme.secondary,
      child: const SingleChildScrollView(
        physics: AlwaysScrollableScrollPhysics(),
        child: Column(
          children: [
            SizedBox(height: 2),
            YouthPrioritiesWidget(),
            SizedBox(height: 2),
          ],
        ),
      ),
    );
  }

  Widget _buildMilestonesTab() {
    return RefreshIndicator(
      onRefresh: () async {
        await Future.delayed(const Duration(seconds: 1));
        HapticFeedback.lightImpact();
      },
      color:Theme.of(context).colorScheme.secondary,
      child: const SingleChildScrollView(
        physics: AlwaysScrollableScrollPhysics(),
        child: Column(
          children: [
            SizedBox(height: 2),
            MilestonesTimelineWidget(),
            SizedBox(height: 2),
            SizedBox(height: 2),
          ],
        ),
      ),
    );
  }
}
