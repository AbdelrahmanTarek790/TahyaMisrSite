import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:tahya_misr_app/core/dependency_injection/injection.dart';
import 'package:tahya_misr_app/shared/widgets/main_navigation.dart';
import 'package:toastification/toastification.dart';


import '../../../../shared/widgets/loading_overlay.dart';
import '../../data/models/join_request_model.dart';
import '../cubits/join_request_cubit.dart';
import '../widgets/join_request_card.dart';
import '../widgets/join_request_filter_bar.dart';
import '../widgets/join_request_action_dialog.dart';

class JoinRequestManagementPage extends StatefulWidget {
  const JoinRequestManagementPage({super.key});

  @override
  State<JoinRequestManagementPage> createState() => _JoinRequestManagementPageState();
}

class _JoinRequestManagementPageState extends State<JoinRequestManagementPage> {
  final ScrollController _scrollController = ScrollController();
  
  String _selectedStatus = 'all';
  String _searchQuery = '';
  int _currentPage = 1;
  final int _pageSize = 10;
  
  List<JoinRequestModel> _joinRequests = [];
  bool _hasMoreData = true;
  bool _isLoadingMore = false;

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadJoinRequests();
    });
  }

  void _onScroll() {
    if (_scrollController.position.pixels >= _scrollController.position.maxScrollExtent - 200) {
      _loadMoreJoinRequests();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('إدارة طلبات الانضمام'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _refreshData,
          ),
        ],
      ),
      body: BlocListener<JoinRequestCubit, JoinRequestState>(
        listener: (context, state) {
          state.when(
            initial: () {},
            loading: () {},
            processing: () {},
            created: () {},
            loaded: (joinRequests, pagination) {
              setState(() {
                if (_currentPage == 1) {
                  _joinRequests = joinRequests;
                } else {
                  _joinRequests.addAll(joinRequests);
                }
                _hasMoreData = _currentPage < pagination.total;
                _isLoadingMore = false;
              });
            },
            detailLoaded: (_) {},
            actionCompleted: (s) {
              getIt<ShowToast>().showToast(
                context: context,
                type: ToastificationType.success,
                message:'تمت العملية بنجاح',
              );
              _refreshData();
            },
            deleted: () {
              toastification.show(
                context: context,
                type: ToastificationType.success,
                style: ToastificationStyle.flat,
                title: const Text('تم حذف الطلب'),
                description: const Text('تم حذف الطلب بنجاح'),
                alignment: Alignment.topCenter,
                autoCloseDuration: const Duration(seconds: 3),
              );
              _refreshData();
            },
            error: (message) {
              toastification.show(
                context: context,
                type: ToastificationType.error,
                style: ToastificationStyle.flat,
                title: const Text('خطأ'),
                description: Text(message),
                alignment: Alignment.topCenter,
                autoCloseDuration: const Duration(seconds: 4),
              );
              setState(() {
                _isLoadingMore = false;
              });
            },
          );
        },
        child: BlocBuilder<JoinRequestCubit, JoinRequestState>(
          builder: (context, state) {
            return LoadingOverlay(
              isLoading: state.maybeWhen(
                loading: () => _currentPage == 1,
                processing: () => true,
                orElse: () => false,
              ),
              child: Column(
                children: [
                  JoinRequestFilterBar(
                    selectedStatus: _selectedStatus,
                    searchQuery: _searchQuery,
                    onStatusChanged: (status) {
                      setState(() {
                        _selectedStatus = status;
                        _currentPage = 1;
                      });
                      _loadJoinRequests();
                    },
                    onSearchChanged: (query) {
                      setState(() {
                        _searchQuery = query;
                        _currentPage = 1;
                      });
                      _loadJoinRequests();
                    },
                  ),
                  Expanded(
                    child: _buildContent(state),
                  ),
                ],
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _buildContent(JoinRequestState state) {
    if (_joinRequests.isEmpty && state.maybeWhen(
      loading: () => false,
      orElse: () => true,
    )) {
      return const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.inbox_outlined,
              size: 64,
              color: Colors.grey,
            ),
            SizedBox(height: 16),
            Text(
              'لا توجد طلبات انضمام',
              style: TextStyle(
                fontSize: 18,
                color: Colors.grey,
              ),
            ),
          ],
        ),
      );
    }

    List<JoinRequestModel> filteredRequests = _joinRequests;
    if (_searchQuery.isNotEmpty) {
      filteredRequests = _joinRequests.where((request) {
        final query = _searchQuery.toLowerCase();
        return request.name.toLowerCase().contains(query) ||
               request.email.toLowerCase().contains(query) ||
               request.phone.contains(query) ||
               request.nationalId.contains(query);
      }).toList();
    }

    return ListView.builder(
      controller: _scrollController,
      padding: const EdgeInsets.all(16),
      itemCount: filteredRequests.length + (_isLoadingMore ? 1 : 0),
      itemBuilder: (context, index) {
        if (index == filteredRequests.length) {
          return const Center(
            child: Padding(
              padding: EdgeInsets.all(16),
              child: CircularProgressIndicator(),
            ),
          );
        }

        final request = filteredRequests[index];
        return JoinRequestCard(
          joinRequest: request,
          onApprove: (id) => _showActionDialog(id, 'approve'),
          onDeny: (id) => _showActionDialog(id, 'deny'),
          onDelete: _deleteJoinRequest,
        );
      },
    );
  }

  void _loadJoinRequests() {
    final cubit = context.read<JoinRequestCubit>();
    cubit.loadJoinRequests(
      page: _currentPage,
      limit: _pageSize,
      status: _selectedStatus != 'all' ? _selectedStatus : null,
    );
  }

  void _loadMoreJoinRequests() {
    if (!_hasMoreData || _isLoadingMore) return;
    
    setState(() {
      _isLoadingMore = true;
      _currentPage++;
    });
    
    _loadJoinRequests();
  }

  void _refreshData() {
    setState(() {
      _currentPage = 1;
      _hasMoreData = true;
      _isLoadingMore = false;
    });
    _loadJoinRequests();
  }

  void _showActionDialog(String id, String action) {
    showDialog(
      context: context,
      builder: (dialogContext) => JoinRequestActionDialog(
        action: action,
        onConfirm: (notes) {
          Navigator.of(dialogContext).pop();
          final cubit = context.read<JoinRequestCubit>();
          if (action == 'approve') {
            cubit.approveJoinRequest(id, notes);
          } else {
            cubit.denyJoinRequest(id, notes);
          }
        },
      ),
    );
  }

  void _deleteJoinRequest(String id) {
    showDialog(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('تأكيد الحذف'),
        content: const Text('هل أنت متأكد من حذف هذا الطلب؟'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(dialogContext).pop(),
            child: const Text('إلغاء'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(dialogContext).pop();
              context.read<JoinRequestCubit>().deleteJoinRequest(id);
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              foregroundColor: Colors.white,
            ),
            child: const Text('حذف'),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }
}