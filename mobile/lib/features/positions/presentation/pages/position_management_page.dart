import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:tahya_misr_app/features/positions/presentation/cubits/positions_cubit.dart';

import '../../../../core/dependency_injection/injection.dart';
import '../../../../gen_l10n/app_localizations.dart';
import '../../data/models/position_model.dart';

class PositionManagementPage extends StatefulWidget {
  const PositionManagementPage({super.key});

  @override
  State<PositionManagementPage> createState() => _PositionManagementPageState();
}

class _PositionManagementPageState extends State<PositionManagementPage> {
  late PositionsCubit _positionsBloc;

  @override
  void initState() {
    super.initState();
    _positionsBloc = getIt<PositionsCubit>();
    _loadPositions();
  }

  @override
  void dispose() {
    _positionsBloc.close();
    super.dispose();
  }

  void _loadPositions() {
    _positionsBloc.getPositions();
  }

  TextEditingController searchController = TextEditingController();
  String statusFilter = 'All'; // All, Active, Inactive
  String typeFilter = 'All'; // All, Global, Local
  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;

    return BlocProvider.value(
      value: _positionsBloc,
      child: Scaffold(
        appBar: AppBar(
          title: Text(l10n.positionManagement),
          backgroundColor: Theme.of(context).colorScheme.primary,
          foregroundColor: Colors.white,
          actions: [
            IconButton(
              icon: const Icon(Icons.add),
              onPressed: () => _showCreatePositionDialog(context, l10n),
            ),
          ],
        ),
        body: BlocListener<PositionsCubit, PositionsState>(
          listener: (context, state) {
            if (state is PositionsError) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(state.message),
                  backgroundColor: Colors.red,
                ),
              );
            }
            else if (state is PositionCreated) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Position created successfully'),
                  backgroundColor: Colors.green,
                ),
              );
              _loadPositions(); // Refresh the list
            }
            else if (state is PositionUpdated) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Position updated successfully'),
                  backgroundColor: Colors.green,
                ),
              );
              _loadPositions(); // Refresh the list
            }
            else if (state is PositionDeleted) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Position deleted successfully'),
                  backgroundColor: Colors.green,
                ),
              );
              _loadPositions(); // Refresh the list
            }
          },
          child: Column(
            children: [
              //Search by name positon , filter by (All - Active - Inactive) or filter by (Global - Local)
              Padding(
                padding: const EdgeInsets.all(12.0),
                child: Column(
                  children: [
                    // 🔍 Search Bar
                    TextField(
                      controller: searchController,
                      decoration: const InputDecoration(
                        labelText: 'Search by name or position',
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.search),
                      ),
                      onChanged: (val) {
                        _positionsBloc.getPositions(
                          name: searchController.text,
                          isActive: typeFilter == 'All'
                              ? null
                              : typeFilter == 'Active'
                                  ? true
                                  : false,
                          isGlobal: statusFilter == 'All'
                              ? null
                              : statusFilter == 'Global'
                                  ? true
                                  : false,
                        );

                      },
                    ),
                    const SizedBox(height: 12),

                    // 🟢 Status Filter
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            const Text('Status: '),
                            const SizedBox(width: 8),
                            DropdownButton<String>(
                              value: statusFilter,
                              items: ['All', 'Active', 'Inactive']
                                  .map((e) =>
                                      DropdownMenuItem(value: e, child: Text(e)),)
                                  .toList(),
                              onChanged: (val) {
                                setState(() => statusFilter = val!);
                                _positionsBloc.getPositions(
                                  name: searchController.text,
                                  isActive: typeFilter == 'All'
                                      ? null
                                      : typeFilter == 'Active'
                                          ? true
                                          : false,
                                  isGlobal: statusFilter == 'All'
                                      ? null
                                      : statusFilter == 'Global'
                                          ? true
                                          : false,
                                );
                              },
                            ),
                          ],
                        ),

                        // 🌍 Type Filter
                        Row(
                          children: [
                            const Text('Type: '),
                            const SizedBox(width: 8),
                            DropdownButton<String>(
                              value: typeFilter,
                              items: ['All', 'Global', 'Local']
                                  .map((e) =>
                                      DropdownMenuItem(value: e, child: Text(e)),)
                                  .toList(),
                              onChanged: (val) {
                                setState(() => typeFilter = val!);
                                _positionsBloc.getPositions(
                                  name: searchController.text,
                                  isActive: statusFilter == 'All'
                                      ? null
                                      : statusFilter == 'Active'
                                          ? true
                                          : false,
                                  isGlobal: typeFilter == 'All'
                                      ? null
                                      : typeFilter == 'Global'
                                          ? true
                                          : false,
                                );
                              },
                            ),
                          ],
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              // Positions List Section
              Expanded(
                child: BlocBuilder<PositionsCubit, PositionsState>(
                  builder: (context, state) {
                    if (state is PositionsLoading) {
                      return const Center(child: CircularProgressIndicator());
                    }
                    else if (state is PositionsLoaded) {
                      return _buildPositionsList(context, state, l10n);
                    } else if (state is PositionsError) {
                      return SingleChildScrollView(
                        child: Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.error_outline,
                                size: 64,
                                color: Theme.of(context).colorScheme.error,
                              ),
                              const SizedBox(height: 16),
                              Text(
                                state.message,
                                style: Theme.of(context).textTheme.titleMedium,
                                textAlign: TextAlign.center,
                              ),
                              const SizedBox(height: 16),
                              ElevatedButton(
                                onPressed: _loadPositions,
                                child: const Text('Retry'),
                              ),
                            ],
                          ),
                        ),
                      );
                    } else {
                      return Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              Icons.work_outline,
                              size: 64,
                              color: Theme.of(context).colorScheme.primary,
                            ),
                            const SizedBox(height: 16),
                            Text(
                              'No positions found',
                              style: Theme.of(context).textTheme.titleMedium,
                            ),
                            const SizedBox(height: 16),
                            ElevatedButton(
                              onPressed: _loadPositions,
                              child: const Text('Load Positions'),
                            ),
                          ],
                        ),
                      );
                    }
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPositionsList(
    BuildContext context,
    PositionsLoaded state,
    AppLocalizations l10n,
  ) {
    return RefreshIndicator(
      onRefresh: () async => _loadPositions(),
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: state.positions.length + 1, // +1 for statistics header
        itemBuilder: (context, index) {
          if (index == 0) {
            // Statistics header
            return Container(
              margin: const EdgeInsets.only(bottom: 16),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    Theme.of(context).colorScheme.primary,
                    Theme.of(context)
                        .colorScheme
                        .primary
                        .withValues(alpha: 0.7),
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _buildStatItem(
                    'Total Positions',
                    '${state.positions.length}',
                    Icons.work,
                  ),
                  _buildStatItem(
                    'Active',
                    '${state.positions.where((p) => p.isActive).length}',
                    Icons.check_circle,
                  ),
                  _buildStatItem(
                    'Global',
                    '${state.positions.where((p) => p.isGlobal).length}',
                    Icons.public,
                  ),
                ],
              ),
            ).animate();
          }

          final position = state.positions[index - 1];
          return _buildPositionCard(context, position, l10n, index - 1);
        },
      ),
    );
  }

  Widget _buildStatItem(String label, String value, IconData icon) {
    return Column(
      children: [
        Icon(icon, color: Colors.white, size: 24),
        const SizedBox(height: 4),
        Text(
          value,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        Text(
          label,
          style: const TextStyle(
            color: Colors.white70,
            fontSize: 12,
          ),
        ),
      ],
    );
  }

  Widget _buildPositionCard(
    BuildContext context,
    PositionModel position,
    AppLocalizations l10n,
    int index,
  ) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          gradient: LinearGradient(
            colors: [
              Theme.of(context).colorScheme.surface,
              Theme.of(context).colorScheme.surface.withValues(alpha: 0.8),
            ],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: ListTile(
          contentPadding: const EdgeInsets.all(16),
          leading: CircleAvatar(
            radius: 30,
            backgroundColor: position.isGlobal ? Colors.purple : Colors.orange,
            child: Icon(
              position.isGlobal ? Icons.public : Icons.location_on,
              color: Colors.white,
              size: 24,
            ),
          ),
          title: Text(
            position.name,
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
          ),
          subtitle: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 8),
              if (position.description != null)
                Text(
                  position.description!,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              const SizedBox(height: 8),
              if (!position.isGlobal)
                Row(
                  children: [
                    const Icon(Icons.place, size: 16),
                    const SizedBox(
                      width: 4,
                    ),
                    Text(
                      position.governorate!,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: position.isGlobal ? Colors.purple : Colors.orange,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      position.isGlobal ? 'Global' : 'Local',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: position.isActive ? Colors.green : Colors.red,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      position.isActive ? 'Active' : 'Inactive',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
          trailing: PopupMenuButton<String>(
            icon: Icon(
              Icons.more_vert,
              color: Theme.of(context).colorScheme.primary,
            ),
            onSelected: (action) =>
                _handlePositionAction(context, action, position, l10n),
            itemBuilder: (context) => [
              PopupMenuItem(
                value: 'edit',
                child: Row(
                  children: [
                    Icon(
                      Icons.edit,
                      color: Theme.of(context).colorScheme.primary,
                    ),
                    const SizedBox(width: 8),
                    const Text('Edit'),
                  ],
                ),
              ),
              const PopupMenuItem(
                value: 'delete',
                child: Row(
                  children: [
                    Icon(Icons.delete, color: Colors.red),
                    SizedBox(width: 8),
                    Text('Delete', style: TextStyle(color: Colors.red)),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    ).animate();
  }

  void _handlePositionAction(
    BuildContext context,
    String action,
    PositionModel position,
    AppLocalizations l10n,
  ) {
    switch (action) {
      case 'edit':
        _showEditPositionDialog(context, position, l10n);
        break;
      case 'delete':
        _showDeletePositionDialog(context, position, l10n);
        break;
    }
  }

  void _showCreatePositionDialog(BuildContext context, AppLocalizations l10n) {
    final nameController = TextEditingController();
    final descriptionController = TextEditingController();
    final governorateController = TextEditingController();
    bool isGlobal = false;
    bool isActive = false;
    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setState) => AlertDialog(
          title: const Text('Create Position'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: nameController,
                  decoration: const InputDecoration(
                    labelText: 'Position Name',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: descriptionController,
                  decoration: const InputDecoration(
                    labelText: 'Description',
                    border: OutlineInputBorder(),
                  ),
                  maxLines: 3,
                ),
                const SizedBox(height: 16),
                CheckboxListTile(
                  title: const Text('Global Position'),
                  value: isGlobal,
                  onChanged: (value) {
                    setState(() {
                      isGlobal = value!;
                    });
                  },
                ),
                const SizedBox(height: 16),
                CheckboxListTile(
                  title: const Text('Active'),
                  value: isActive,
                  onChanged: (value) {
                    setState(() {
                      isActive = value!;
                    });
                  },
                ),
                DropdownButtonFormField(
                    decoration: const InputDecoration(
                      labelText: 'Governorate',
                      border: OutlineInputBorder(),
                    ),
                    items: l10n.governorates
                        .map((gov) => DropdownMenuItem(
                              value: gov,
                              child: Text(gov),
                            ),)
                        .toList(),

                    onChanged: (val) {
                      governorateController.text = val!;
                    },
                 ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () {
                final positionData = {
                  'name': nameController.text,
                  'description': descriptionController.text,
                  'isGlobal': isGlobal,
                  'isActive': isActive,
                  'governorate': governorateController.text,
                };

                _positionsBloc.createPosition(positionData);
                Navigator.of(context).pop();
              },
              child: const Text('Create'),
            ),
          ],
        ),
      ),
    );
  }

  void _showEditPositionDialog(
    BuildContext context,
    PositionModel position,
    AppLocalizations l10n,
  ) {
    final nameController = TextEditingController(text: position.name);
    final descriptionController = TextEditingController(text: position.description ?? '');
    final governorateController = TextEditingController(text: position.governorate ?? '');
    bool isGlobal = position.isGlobal;
    bool isActive = position.isActive;

    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setState) => AlertDialog(
          title: const Text('Edit Position'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: nameController,
                  decoration: const InputDecoration(
                    labelText: 'Position Name',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: descriptionController,
                  decoration: const InputDecoration(
                    labelText: 'Description',
                    border: OutlineInputBorder(),
                  ),
                  maxLines: 3,
                ),
                const SizedBox(height: 16),
                CheckboxListTile(
                  title: const Text('Global Position'),
                  value: isGlobal,
                  onChanged: (value) {
                    setState(() {
                      isGlobal = value!;
                    });
                  },
                ),
                const SizedBox(height: 16),
                CheckboxListTile(
                  title: const Text('Active'),
                  value: isActive,
                  onChanged: (value) {
                    setState(() {
                      isActive = value!;
                    });
                  },
                ),
                DropdownButtonFormField(
                  initialValue:governorateController.text,
                  decoration: const InputDecoration(
                    labelText: 'Governorate',
                    border: OutlineInputBorder(),
                  ),
                  items: l10n.governorates
                      .map((gov) => DropdownMenuItem(
                    value: gov,
                    child: Text(gov),
                  ),)
                      .toList(),

                  onChanged: (val) {
                    governorateController.text = val!;
                  },
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () {
                final positionData = {
                  'name': nameController.text,
                  'description': descriptionController.text,
                  'governorate': governorateController.text,
                  'isGlobal': isGlobal,
                  'isActive': isActive,
                };

                _positionsBloc.updatePosition(
                  position.id,
                  positionData,
                );
                Navigator.of(context).pop();
              },
              child: const Text('Save'),
            ),
          ],
        ),
      ),
    );
  }

  void _showDeletePositionDialog(
    BuildContext context,
    PositionModel position,
    AppLocalizations l10n,
  ) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Position'),
        content: Text('Are you sure you want to delete: ${position.name}?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              foregroundColor: Colors.white,
            ),
            onPressed: () {
              _positionsBloc.deletePosition(position.id);
              Navigator.of(context).pop();
            },
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }
}
