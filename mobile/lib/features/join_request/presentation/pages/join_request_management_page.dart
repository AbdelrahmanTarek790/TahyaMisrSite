import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../gen_l10n/app_localizations.dart';
import '../../domain/entities/join_request.dart';
import '../bloc/join_request_management_cubit.dart';
import '../bloc/join_request_management_state.dart';
import '../widgets/join_request_card.dart';
import '../widgets/join_request_action_dialog.dart';

class JoinRequestManagementPage extends StatefulWidget {
  const JoinRequestManagementPage({super.key});

  @override
  State<JoinRequestManagementPage> createState() => _JoinRequestManagementPageState();
}

class _JoinRequestManagementPageState extends State<JoinRequestManagementPage> {
  String? _selectedStatus;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<JoinRequestManagementCubit>().loadJoinRequests();
    });
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.joinRequestManagement),
        centerTitle: true,
      ),
      body: Column(
        children: [
          _buildStatusFilter(context, l10n, theme),
          Expanded(
            child: BlocConsumer<JoinRequestManagementCubit, JoinRequestManagementState>(
              listener: (context, state) {
                state.whenOrNull(
                  actionSuccess: (message) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(message),
                        backgroundColor: theme.colorScheme.primary,
                      ),
                    );
                  },
                  error: (message) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(message),
                        backgroundColor: theme.colorScheme.error,
                      ),
                    );
                  },
                );
              },
              builder: (context, state) {
                return state.when(
                  initial: () => const Center(child: CircularProgressIndicator()),
                  loading: () => const Center(child: CircularProgressIndicator()),
                  loaded: (joinRequests, currentPage, totalPages, totalCount, selectedStatus) =>
                      _buildLoadedContent(context, l10n, joinRequests, currentPage, totalPages, totalCount),
                  processing: (requestId) => _buildProcessingOverlay(context, l10n),
                  actionSuccess: (message) => const Center(child: CircularProgressIndicator()),
                  error: (message) => _buildErrorWidget(context, l10n, message),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatusFilter(BuildContext context, AppLocalizations l10n, ThemeData theme) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        boxShadow: [
          BoxShadow(
            color: theme.shadowColor.withOpacity(0.1),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          Icon(Icons.filter_list, color: theme.colorScheme.primary),
          const SizedBox(width: 8),
          Text(
            l10n.filterByStatus,
            style: theme.textTheme.titleMedium,
          ),
          const SizedBox(width: 16),
          Expanded(
            child: DropdownButtonFormField<String?>(
              value: _selectedStatus,
              decoration: const InputDecoration(
                border: OutlineInputBorder(),
                contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              ),
              items: [
                DropdownMenuItem<String?>(
                  value: null,
                  child: Text(l10n.all),
                ),
                DropdownMenuItem<String>(
                  value: 'pending',
                  child: Text(l10n.pending),
                ),
                DropdownMenuItem<String>(
                  value: 'approved',
                  child: Text(l10n.approved),
                ),
                DropdownMenuItem<String>(
                  value: 'denied',
                  child: Text(l10n.denied),
                ),
              ],
              onChanged: (value) {
                setState(() {
                  _selectedStatus = value;
                });
                context.read<JoinRequestManagementCubit>().filterByStatus(value);
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLoadedContent(
    BuildContext context,
    AppLocalizations l10n,
    List<JoinRequest> joinRequests,
    int currentPage,
    int totalPages,
    int totalCount,
  ) {
    if (joinRequests.isEmpty) {
      return _buildEmptyState(l10n);
    }

    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(16),
          child: Text(
            l10n.totalRequests(totalCount),
            style: Theme.of(context).textTheme.titleMedium,
          ),
        ),
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: joinRequests.length,
            itemBuilder: (context, index) {
              final request = joinRequests[index];
              return Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: JoinRequestCard(
                  request: request,
                  onApprove: () => _showActionDialog(
                    context,
                    request,
                    isApproval: true,
                  ),
                  onDeny: () => _showActionDialog(
                    context,
                    request,
                    isApproval: false,
                  ),
                ),
              );
            },
          ),
        ),
        if (totalPages > 1) _buildPagination(context, l10n, currentPage, totalPages),
      ],
    );
  }

  Widget _buildEmptyState(AppLocalizations l10n) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.inbox,
            size: 64,
            color: Theme.of(context).colorScheme.outline,
          ),
          const SizedBox(height: 16),
          Text(
            l10n.noRequestsFound,
            style: Theme.of(context).textTheme.titleLarge,
          ),
        ],
      ),
    );
  }

  Widget _buildPagination(BuildContext context, AppLocalizations l10n, int currentPage, int totalPages) {
    return Container(
      padding: const EdgeInsets.all(16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          ElevatedButton.icon(
            onPressed: currentPage > 1
                ? () => context.read<JoinRequestManagementCubit>().loadPreviousPage()
                : null,
            icon: const Icon(Icons.arrow_back),
            label: Text(l10n.previous),
          ),
          Text(
            l10n.pageOf(currentPage, totalPages),
            style: Theme.of(context).textTheme.titleMedium,
          ),
          ElevatedButton.icon(
            onPressed: currentPage < totalPages
                ? () => context.read<JoinRequestManagementCubit>().loadNextPage()
                : null,
            icon: const Icon(Icons.arrow_forward),
            label: Text(l10n.next),
          ),
        ],
      ),
    );
  }

  Widget _buildProcessingOverlay(BuildContext context, AppLocalizations l10n) {
    return Stack(
      children: [
        Container(
          color: Colors.black.withOpacity(0.3),
          child: const Center(
            child: CircularProgressIndicator(),
          ),
        ),
        Center(
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.surface,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const CircularProgressIndicator(),
                const SizedBox(height: 16),
                Text(l10n.processingRequest),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildErrorWidget(BuildContext context, AppLocalizations l10n, String message) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.error,
            size: 64,
            color: Theme.of(context).colorScheme.error,
          ),
          const SizedBox(height: 16),
          Text(
            l10n.errorLoadingRequests,
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(height: 8),
          Text(message),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: () {
              context.read<JoinRequestManagementCubit>().loadJoinRequests();
            },
            child: const Text('Retry'),
          ),
        ],
      ),
    );
  }

  void _showActionDialog(BuildContext context, JoinRequest request, {required bool isApproval}) {
    showDialog(
      context: context,
      builder: (dialogContext) => JoinRequestActionDialog(
        request: request,
        isApproval: isApproval,
        onAction: (notes, university, membershipExpiry) {
          if (isApproval) {
            context.read<JoinRequestManagementCubit>().approveRequest(
                  requestId: request.name, // Using name as ID for now, should use actual ID
                  notes: notes,
                  university: university,
                  membershipExpiry: membershipExpiry,
                );
          } else {
            context.read<JoinRequestManagementCubit>().denyRequest(
                  requestId: request.name, // Using name as ID for now, should use actual ID
                  notes: notes,
                );
          }
        },
      ),
    );
  }
}