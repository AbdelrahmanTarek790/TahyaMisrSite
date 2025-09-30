import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../core/constants/app_theme.dart';
import '../../../gen_l10n/app_localizations.dart';
import '../../home/presentation/widgets/custom_icon_widget.dart';
import '../../timeline/presentation/cubits/timeline_cubit.dart';

class WorkingAreasWidget extends StatefulWidget {
  const WorkingAreasWidget({super.key});

  @override
  State<WorkingAreasWidget> createState() => _WorkingAreasWidgetState();
}

class _WorkingAreasWidgetState extends State<WorkingAreasWidget> {
  bool _isExpanded = false;

  final ScrollController _scrollController = ScrollController();
  late Timer _timer;
  double _position = 0;

  @override
  void initState() {
    super.initState();
    _startAutoScroll();
    context.read<TimelineCubit>().getTimeline();
  }

  void _startAutoScroll() {
    _timer = Timer.periodic(const Duration(seconds: 3), (timer) {
      if (_scrollController.hasClients) {
        final maxScroll = _scrollController.position.maxScrollExtent;
        if (_position >= maxScroll) {
          // لما يوصل للنهاية يرجع للبداية
          _position = 0;
        } else {
          _position +=
              MediaQuery.of(context).size.width * 0.7; // يتحرك بمقدار كارت
        }

        _scrollController.animateTo(
          _position,
          duration: const Duration(milliseconds: 600),
          curve: Curves.easeInOut,
        );
      }
    });
  }

  @override
  void dispose() {
    _timer.cancel();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return BlocConsumer<TimelineCubit,TimelineState>(
      listener: (context, state) {},
      builder: (context, state) {
        if(state is TimelineLoading){
          return const Center(child: CircularProgressIndicator());
        }
        if(state is TimelineError){
          return Center(child: Text(state.message,style: AppTheme.textTheme.bodyMedium?.copyWith(),));
        }
        final workingAreas = (state as TimelineLoaded).timeline;
        return Card(
          margin: const EdgeInsets.symmetric(horizontal: 4, vertical: 1),
          elevation: 2,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          child: Column(
            children: [
              InkWell(
                onTap: () {
                  setState(() {
                    _isExpanded = !_isExpanded;
                    if (!_isExpanded) {
                      // رجع الاسكرول لأول الليست
                      Future.delayed(const Duration(milliseconds: 300), () {
                        if (_scrollController.hasClients) {
                          _scrollController.jumpTo(0);
                        }
                        _position = 0;
                      });
                    }
                  });
                },
                borderRadius: BorderRadius.circular(12),
                child: Row(
                  children: [
                    Container(
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const CustomIconWidget(
                        iconName: 'work_outline',
                        size: 24,
                      ),
                    ),
                    const SizedBox(width: 3),
                    Expanded(
                      child: Text(
                        l10n.journeyUnion,
                        style: AppTheme.lightTheme.textTheme.titleLarge
                            ?.copyWith(
                          fontWeight: FontWeight.bold,
                          color: AppTheme.lightTheme.colorScheme.primary,
                        ),
                      ),
                    ),
                    CustomIconWidget(
                      iconName: _isExpanded ? 'expand_less' : 'expand_more',
                      color: AppTheme.lightTheme.colorScheme.primary,
                      size: 24,
                    ),
                  ],
                ),
              ),
              AnimatedContainer(
                duration: const Duration(milliseconds: 300),
                curve: Curves.easeInOut,
                height: _isExpanded ? null : 0,
                child: _isExpanded
                    ? Container(
                  padding: const EdgeInsets.fromLTRB(4, 0, 4, 4),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Divider(
                        color: AppTheme.lightTheme.dividerColor,
                        thickness: 1,
                      ),
                      const SizedBox(height: 3),
                      AspectRatio(
                        key: const ValueKey('slider'),
                        aspectRatio: 20 / 13,
                        child: ListView.builder(
                          controller: _scrollController,
                          scrollDirection: Axis.horizontal,
                          itemCount: workingAreas.length,
                          itemBuilder: (context, index) {
                            return Container(
                              width: MediaQuery
                                  .of(context)
                                  .size
                                  .width * 0.7,
                              margin: const EdgeInsets.all(8),
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color:
                                AppTheme.lightTheme.colorScheme.surface,
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(
                                  width: 1.5,
                                ),
                                boxShadow: const [
                                  BoxShadow(
                                    blurRadius: 8,
                                    offset: Offset(0, 4),
                                  ),
                                ],
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      CircleAvatar(
                                        radius: 20,
                                        backgroundColor: AppTheme
                                            .lightTheme.colorScheme.primary,
                                        child: Text(
                                          workingAreas[index].year,
                                          style: AppTheme.textTheme.bodyMedium
                                              ?.copyWith(
                                            fontWeight: FontWeight.bold,
                                            color: Colors.white,),
                                        ),
                                      ),
                                      const SizedBox(width: 3),
                                      Expanded(
                                        child: Text(
                                          workingAreas[index].title,
                                          style: AppTheme.lightTheme.textTheme
                                              .titleMedium
                                              ?.copyWith(
                                            fontWeight: FontWeight.bold,
                                            color: AppTheme.lightTheme
                                                .colorScheme.primary,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    workingAreas[index].description,
                                    style: AppTheme.textTheme.bodyMedium
                                        ?.copyWith(
                                      color: AppTheme.text,
                                      height: 1.5,
                                    ),
                                  ),
                                  const SizedBox(height: 3),
                                  Row(
                                    children: [
                                      const Icon(
                                        Icons.wine_bar,
                                        size: 16,
                                        color: AppTheme.primaryColor,
                                      ),
                                      const SizedBox(width: 4),
                                      Text(
                                        'إنجاز رئيسي',
                                        style: AppTheme.textTheme.bodyMedium
                                            ?.copyWith(
                                          color: AppTheme.text,
                                          height: 1.5,
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 3),
                                  Text(
                                    workingAreas[index].achievement,
                                    style: AppTheme.textTheme.bodyMedium
                                        ?.copyWith(
                                      color: AppTheme.text,
                                    ),
                                  ),
                                ],
                              ),
                            );
                          },
                        ),
                      ),
                    ],
                  ),
                )
                    : const SizedBox.shrink(),
              ),
            ],
          ),
        );
      },
    );
  }
}
