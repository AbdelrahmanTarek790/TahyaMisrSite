import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:infinite_scroll_pagination/infinite_scroll_pagination.dart';

import '../../../../core/dependency_injection/injection.dart';
import '../../data/models/join_request_action.dart';
import '../../domain/entities/join_request.dart';
import '../bloc/join_request_bloc.dart';
import '../bloc/join_request_event.dart';
import '../bloc/join_request_state.dart';
import '../widgets/join_request_card.dart';
import '../widgets/join_request_filters.dart';

class JoinRequestManagementPage extends StatelessWidget {
  const JoinRequestManagementPage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => getIt<JoinRequestBloc>(),
      child: const _JoinRequestManagementBody(),
    );
  }
}

class _JoinRequestManagementBody extends StatefulWidget {
  const _JoinRequestManagementBody();

  @override
  State<_JoinRequestManagementBody> createState() => _JoinRequestManagementBodyState();
}

class _JoinRequestManagementBodyState extends State<_JoinRequestManagementBody> {
  final PagingController<int, JoinRequest> _pagingController =
      PagingController(firstPageKey: 1);
  
  String _statusFilter = 'all';
  static const int _pageSize = 10;

  @override
  void initState() {
    super.initState();
    _pagingController.addPageRequestListener((pageKey) {
      context.read<JoinRequestBloc>().add(
        JoinRequestEvent.getJoinRequests(
          page: pageKey,
          limit: _pageSize,
          status: _statusFilter == 'all' ? null : _statusFilter,
        ),
      );
    });
  }

  @override
  void dispose() {
    _pagingController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('إدارة طلبات الانضمام'),
        backgroundColor: Theme.of(context).colorScheme.primary,
        foregroundColor: Colors.white,
        centerTitle: true,
      ),
      body: BlocListener<JoinRequestBloc, JoinRequestState>(
        listener: (context, state) {
          state.when(
            initial: () {},
            loading: () {},
            joinRequestsLoaded: (joinRequests, currentPage, hasMore) {
              if (currentPage == 1) {
                _pagingController.refresh();
              }
              
              final isLastPage = !hasMore;
              if (isLastPage) {
                _pagingController.appendLastPage(joinRequests);
              } else {
                final nextPageKey = currentPage + 1;
                _pagingController.appendPage(joinRequests, nextPageKey);
              }
            },
            joinRequestLoaded: (_) {},
            actionCompleted: (message) {
              _showSuccessSnackBar(message);
              _refreshList();
            },
            error: (message) {
              _pagingController.error = message;
              _showErrorSnackBar(message);
            },
          );
        },
        child: Column(
          children: [
            _buildHeader(),
            _buildFilters(),
            Expanded(
              child: _buildJoinRequestsList(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.blue.shade50,
        borderRadius: const BorderRadius.only(
          bottomLeft: Radius.circular(16),
          bottomRight: Radius.circular(16),
        ),
      ),
      child: Row(
        children: [
          Icon(
            Icons.admin_panel_settings,
            size: 32,
            color: Colors.blue.shade600,
          ),
          const SizedBox(width: 12),
          const Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'إدارة طلبات الانضمام',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Colors.black87,
                ),
              ),
              Text(
                'مراجعة والموافقة على طلبات الأعضاء الجدد',
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.black54,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildFilters() {
    return JoinRequestFilters(
      selectedStatus: _statusFilter,
      onStatusChanged: (status) {
        setState(() {
          _statusFilter = status;
        });
        _refreshList();
      },
    );
  }

  Widget _buildJoinRequestsList() {
    return RefreshIndicator(
      onRefresh: () => Future.sync(() => _refreshList()),
      child: PagedListView<int, JoinRequest>(
        pagingController: _pagingController,
        builderDelegate: PagedChildBuilderDelegate<JoinRequest>(
          itemBuilder: (context, item, index) => Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: JoinRequestCard(
              joinRequest: item,
              onApprove: () => _showApproveDialog(item),
              onDeny: () => _showDenyDialog(item),
              onDelete: () => _showDeleteDialog(item),
            ),
          ),
          firstPageErrorIndicatorBuilder: (context) => _buildErrorWidget(),
          newPageErrorIndicatorBuilder: (context) => _buildErrorWidget(),
          firstPageProgressIndicatorBuilder: (context) => _buildLoadingWidget(),
          newPageProgressIndicatorBuilder: (context) => _buildLoadingWidget(),
          noItemsFoundIndicatorBuilder: (context) => _buildEmptyWidget(),
        ),
      ),
    );
  }

  Widget _buildLoadingWidget() {
    return const Center(
      child: Padding(
        padding: EdgeInsets.all(32),
        child: Column(
          children: [
            CircularProgressIndicator(),
            SizedBox(height: 16),
            Text('جاري تحميل الطلبات...'),
          ],
        ),
      ),
    );
  }

  Widget _buildErrorWidget() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          children: [
            const Icon(Icons.error_outline, size: 64, color: Colors.red),
            const SizedBox(height: 16),
            const Text(
              'حدث خطأ في تحميل الطلبات',
              style: TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 16),
            ElevatedButton.icon(
              onPressed: _refreshList,
              icon: const Icon(Icons.refresh),
              label: const Text('إعادة المحاولة'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyWidget() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          children: [
            Icon(
              Icons.inbox_outlined,
              size: 64,
              color: Colors.grey.shade400,
            ),
            const SizedBox(height: 16),
            Text(
              'لا توجد طلبات انضمام',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey.shade600,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'لم يتم العثور على طلبات مطابقة للفلتر المحدد',
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey.shade500,
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _refreshList() {
    _pagingController.refresh();
  }

  void _showApproveDialog(JoinRequest request) {
    final notesController = TextEditingController();
    final universityController = TextEditingController();
    
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('الموافقة على طلب الانضمام'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('هل تريد الموافقة على طلب انضمام ${request.name}؟'),
            const SizedBox(height: 16),
            TextField(
              controller: universityController,
              decoration: const InputDecoration(
                labelText: 'الجامعة (اختياري)',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: notesController,
              decoration: const InputDecoration(
                labelText: 'ملاحظات الموافقة',
                border: OutlineInputBorder(),
              ),
              maxLines: 3,
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('إلغاء'),
          ),
          ElevatedButton(
            onPressed: () {
              if (notesController.text.trim().isNotEmpty) {
                final action = JoinRequestAction(
                  notes: notesController.text.trim(),
                  university: universityController.text.trim().isNotEmpty 
                      ? universityController.text.trim() 
                      : null,
                  membershipExpiry: DateTime.now().add(const Duration(days: 365)),
                );
                
                context.read<JoinRequestBloc>().add(
                  JoinRequestEvent.approveJoinRequest(id: request.id, action: action),
                );
                
                Navigator.of(context).pop();
              }
            },
            child: const Text('موافقة'),
          ),
        ],
      ),
    ).then((_) {
      notesController.dispose();
      universityController.dispose();
    });
  }

  void _showDenyDialog(JoinRequest request) {
    final notesController = TextEditingController();
    
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('رفض طلب الانضمام'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('هل تريد رفض طلب انضمام ${request.name}؟'),
            const SizedBox(height: 16),
            TextField(
              controller: notesController,
              decoration: const InputDecoration(
                labelText: 'سبب الرفض',
                border: OutlineInputBorder(),
              ),
              maxLines: 3,
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('إلغاء'),
          ),
          ElevatedButton(
            onPressed: () {
              if (notesController.text.trim().isNotEmpty) {
                final action = JoinRequestAction(
                  notes: notesController.text.trim(),
                );
                
                context.read<JoinRequestBloc>().add(
                  JoinRequestEvent.denyJoinRequest(id: request.id, action: action),
                );
                
                Navigator.of(context).pop();
              }
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('رفض'),
          ),
        ],
      ),
    ).then((_) {
      notesController.dispose();
    });
  }

  void _showDeleteDialog(JoinRequest request) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('حذف طلب الانضمام'),
        content: Text('هل تريد حذف طلب انضمام ${request.name}؟\nهذا الإجراء لا يمكن التراجع عنه.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('إلغاء'),
          ),
          ElevatedButton(
            onPressed: () {
              context.read<JoinRequestBloc>().add(
                JoinRequestEvent.deleteJoinRequest(id: request.id),
              );
              Navigator.of(context).pop();
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('حذف'),
          ),
        ],
      ),
    );
  }

  void _showSuccessSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.green,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  void _showErrorSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }
}