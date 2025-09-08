import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/dependency_injection/injection.dart';
import '../../../../gen_l10n/app_localizations.dart';
import '../../../auth/data/models/user_model.dart';
import '../bloc/user_management_bloc.dart';
import '../bloc/user_management_event.dart';
import '../bloc/user_management_state.dart';

class UserManagementPage extends StatefulWidget {
  const UserManagementPage({super.key});

  @override
  State<UserManagementPage> createState() => _UserManagementPageState();
}

class _UserManagementPageState extends State<UserManagementPage> {
  String _selectedRole = 'All';
  final TextEditingController _searchController = TextEditingController();
  late UserManagementBloc _userManagementBloc;

  final List<String> _roles = ['All', 'admin', 'volunteer', 'student'];

  @override
  void initState() {
    super.initState();
    _userManagementBloc = getIt<UserManagementBloc>();
    _loadUsers();
  }

  @override
  void dispose() {
    _searchController.dispose();
    _userManagementBloc.close();
    super.dispose();
  }

  void _loadUsers() {
    _userManagementBloc.add(GetUsersEvent(
      page: 1,
      limit: 20,
      search: _searchController.text.isNotEmpty ? _searchController.text : null,
      role: _selectedRole != 'All' ? _selectedRole : null,
    ));
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    
    return BlocProvider.value(
      value: _userManagementBloc,
      child: Scaffold(
        appBar: AppBar(
          title: Text(l10n.userManagement),
          backgroundColor: Theme.of(context).colorScheme.primary,
          foregroundColor: Colors.white,
          actions: [
            IconButton(
              icon: const Icon(Icons.add),
              onPressed: () => _showCreateUserDialog(context, l10n),
            ),
          ],
        ),
        body: BlocListener<UserManagementBloc, UserManagementState>(
          listener: (context, state) {
            if (state is UserManagementError) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(state.message),
                  backgroundColor: Colors.red,
                ),
              );
            } else if (state is UserCreated) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(l10n.userCreatedSuccessfully),
                  backgroundColor: Colors.green,
                ),
              );
              _loadUsers(); // Refresh the list
            } else if (state is UserUpdated) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(l10n.userUpdatedSuccessfully),
                  backgroundColor: Colors.green,
                ),
              );
              _loadUsers(); // Refresh the list
            } else if (state is UserDeleted) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(l10n.userDeletedSuccessfully),
                  backgroundColor: Colors.green,
                ),
              );
              _loadUsers(); // Refresh the list
            }
          },
          child: Column(
            children: [
              // Search and Filters Section
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.surface,
                  border: Border(
                    bottom: BorderSide(
                      color: Theme.of(context).dividerColor,
                      width: 1,
                    ),
                  ),
                ),
                child: Column(
                  children: [
                    // Search Bar
                    TextField(
                      controller: _searchController,
                      decoration: InputDecoration(
                        hintText: l10n.searchUsers,
                        prefixIcon: const Icon(Icons.search),
                        suffixIcon: _searchController.text.isNotEmpty
                            ? IconButton(
                                icon: const Icon(Icons.clear),
                                onPressed: () {
                                  _searchController.clear();
                                  _loadUsers();
                                },
                              )
                            : null,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        filled: true,
                        fillColor: Theme.of(context).colorScheme.background,
                      ),
                      onChanged: (value) {
                        // Debounce search
                        Future.delayed(const Duration(milliseconds: 500), () {
                          if (value == _searchController.text) {
                            _loadUsers();
                          }
                        });
                      },
                    ),
                    const SizedBox(height: 16),
                    // Role Filter
                    Row(
                      children: [
                        Text(
                          '${l10n.role}:',
                          style: Theme.of(context).textTheme.titleMedium,
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: DropdownButtonFormField<String>(
                            value: _selectedRole,
                            decoration: InputDecoration(
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                              filled: true,
                              fillColor: Theme.of(context).colorScheme.background,
                            ),
                            items: _roles.map((role) {
                              return DropdownMenuItem(
                                value: role,
                                child: Text(_getRoleDisplayName(role, l10n)),
                              );
                            }).toList(),
                            onChanged: (value) {
                              setState(() {
                                _selectedRole = value!;
                              });
                              _loadUsers();
                            },
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              // Users List Section
              Expanded(
                child: BlocBuilder<UserManagementBloc, UserManagementState>(
                  builder: (context, state) {
                    if (state is UserManagementLoading) {
                      return const Center(child: CircularProgressIndicator());
                    } else if (state is UsersLoaded) {
                      return _buildUsersList(context, state, l10n);
                    } else if (state is UserManagementError) {
                      return Center(
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
                              onPressed: _loadUsers,
                              child: Text(l10n.retry),
                            ),
                          ],
                        ),
                      );
                    } else {
                      return Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              Icons.people_outline,
                              size: 64,
                              color: Theme.of(context).colorScheme.primary,
                            ),
                            const SizedBox(height: 16),
                            Text(
                              l10n.noUsersFound,
                              style: Theme.of(context).textTheme.titleMedium,
                            ),
                            const SizedBox(height: 16),
                            ElevatedButton(
                              onPressed: _loadUsers,
                              child: Text(l10n.loadUsers),
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

  Widget _buildUsersList(BuildContext context, UsersLoaded state, AppLocalizations l10n) {
    return RefreshIndicator(
      onRefresh: () async => _loadUsers(),
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: state.users.length + 1, // +1 for statistics header
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
                    Theme.of(context).colorScheme.primary.withOpacity(0.7),
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _buildStatItem(l10n.totalUsers, '${state.totalUsers}', Icons.people),
                  _buildStatItem(l10n.currentPage, '${state.currentPage}', Icons.pages),
                  _buildStatItem(l10n.totalPages, '${state.totalPages}', Icons.library_books),
                ],
              ),
            ).animate().slideInUp(duration: 300.ms);
          }

          final user = state.users[index - 1];
          return _buildUserCard(context, user, l10n, index - 1);
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

  Widget _buildUserCard(BuildContext context, UserModel user, AppLocalizations l10n, int index) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: ListTile(
        contentPadding: const EdgeInsets.all(16),
        leading: CircleAvatar(
          backgroundColor: Theme.of(context).colorScheme.primary,
          child: Text(
            user.name.isNotEmpty ? user.name[0].toUpperCase() : 'U',
            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
          ),
        ),
        title: Text(
          user.name,
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
              ),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 4),
            Text(user.email),
            const SizedBox(height: 2),
            Row(
              children: [
                Icon(
                  Icons.phone,
                  size: 14,
                  color: Theme.of(context).colorScheme.secondary,
                ),
                const SizedBox(width: 4),
                Text(user.phone ?? l10n.notProvided),
                const SizedBox(width: 16),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(
                    color: _getRoleColor(user.role),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    _getRoleDisplayName(user.role, l10n),
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
          onSelected: (action) => _handleUserAction(context, action, user, l10n),
          itemBuilder: (context) => [
            PopupMenuItem(
              value: 'edit',
              child: Row(
                children: [
                  const Icon(Icons.edit),
                  const SizedBox(width: 8),
                  Text(l10n.edit),
                ],
              ),
            ),
            PopupMenuItem(
              value: 'changeRole',
              child: Row(
                children: [
                  const Icon(Icons.admin_panel_settings),
                  const SizedBox(width: 8),
                  Text(l10n.changeRole),
                ],
              ),
            ),
            PopupMenuItem(
              value: 'delete',
              child: Row(
                children: [
                  const Icon(Icons.delete, color: Colors.red),
                  const SizedBox(width: 8),
                  Text(l10n.delete, style: const TextStyle(color: Colors.red)),
                ],
              ),
            ),
          ],
        ),
      ),
    ).animate().slideInLeft(
      duration: 300.ms,
      delay: (index * 100).ms,
    );
  }

  void _handleUserAction(BuildContext context, String action, UserModel user, AppLocalizations l10n) {
    switch (action) {
      case 'edit':
        _showEditUserDialog(context, user, l10n);
        break;
      case 'changeRole':
        _showChangeRoleDialog(context, user, l10n);
        break;
      case 'delete':
        _showDeleteUserDialog(context, user, l10n);
        break;
    }
  }

  void _showCreateUserDialog(BuildContext context, AppLocalizations l10n) {
    // TODO: Implement create user dialog
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(l10n.createUser),
        content: const Text('Create user feature will be implemented in the next update.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: Text(l10n.ok),
          ),
        ],
      ),
    );
  }

  void _showEditUserDialog(BuildContext context, UserModel user, AppLocalizations l10n) {
    // TODO: Implement edit user dialog
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(l10n.editUser),
        content: const Text('Edit user feature will be implemented in the next update.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: Text(l10n.ok),
          ),
        ],
      ),
    );
  }

  void _showChangeRoleDialog(BuildContext context, UserModel user, AppLocalizations l10n) {
    String selectedRole = user.role;
    
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(l10n.changeRole),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('${l10n.changeRoleFor}: ${user.name}'),
            const SizedBox(height: 16),
            DropdownButtonFormField<String>(
              value: selectedRole,
              decoration: InputDecoration(
                labelText: l10n.selectRole,
                border: const OutlineInputBorder(),
              ),
              items: _roles.skip(1).map((role) { // Skip 'All' option
                return DropdownMenuItem(
                  value: role,
                  child: Text(_getRoleDisplayName(role, l10n)),
                );
              }).toList(),
              onChanged: (value) {
                selectedRole = value!;
              },
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: Text(l10n.cancel),
          ),
          ElevatedButton(
            onPressed: () {
              _userManagementBloc.add(UpdateUserEvent(
                userId: user.id,
                userData: {'role': selectedRole},
              ));
              Navigator.of(context).pop();
            },
            child: Text(l10n.save),
          ),
        ],
      ),
    );
  }

  void _showDeleteUserDialog(BuildContext context, UserModel user, AppLocalizations l10n) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(l10n.deleteUser),
        content: Text('${l10n.deleteUserConfirmation}: ${user.name}?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: Text(l10n.cancel),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              foregroundColor: Colors.white,
            ),
            onPressed: () {
              _userManagementBloc.add(DeleteUserEvent(userId: user.id));
              Navigator.of(context).pop();
            },
            child: Text(l10n.delete),
          ),
        ],
      ),
    );
  }

  String _getRoleDisplayName(String role, AppLocalizations l10n) {
    switch (role.toLowerCase()) {
      case 'admin':
        return l10n.admin;
      case 'volunteer':
        return l10n.volunteer;
      case 'student':
        return l10n.student;
      case 'all':
        return l10n.all;
      default:
        return role;
    }
  }

  Color _getRoleColor(String role) {
    switch (role.toLowerCase()) {
      case 'admin':
        return Colors.red;
      case 'volunteer':
        return Colors.blue;
      case 'student':
        return Colors.green;
      default:
        return Colors.grey;
    }
  }
}
          'role': 'volunteer',
          'phone': '01198765432',
          'university': 'جامعة عين شمس',
          'governorate': 'القاهرة',
        },
        {
          'id': '3',
          'name': 'محمد حسن',
          'email': 'mohamed@example.com',
          'role': 'student',
          'phone': '01087654321',
          'university': 'جامعة الإسكندرية',
          'governorate': 'الإسكندرية',
        },
        {
          'id': '4',
          'name': 'سارة أحمد',
          'email': 'sara@example.com',
          'role': 'student',
          'phone': '01156789012',
          'university': 'جامعة الأزهر',
          'governorate': 'الجيزة',
        },
        {
          'id': '5',
          'name': 'علي محمود',
          'email': 'ali@example.com',
          'role': 'volunteer',
          'phone': '01234567890',
          'university': 'جامعة أسوان',
          'governorate': 'أسوان',
        },
      ];
      _filteredUsers = List.from(_users);
      _isLoading = false;
    });
  }

  void _filterUsers() {
    setState(() {
      _filteredUsers = _users.where((user) {
        bool matchesSearch = _searchController.text.isEmpty ||
            user['name'].toString().toLowerCase().contains(_searchController.text.toLowerCase()) ||
            user['email'].toString().toLowerCase().contains(_searchController.text.toLowerCase());
        
        bool matchesRole = _selectedRole == 'All' || user['role'] == _selectedRole;
        bool matchesGovernorate = _selectedGovernorate == 'All' || user['governorate'] == _selectedGovernorate;
        bool matchesUniversity = _selectedUniversity == 'All' || user['university'] == _selectedUniversity;
        
        return matchesSearch && matchesRole && matchesGovernorate && matchesUniversity;
      }).toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    
    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.userManagement),
        backgroundColor: Theme.of(context).colorScheme.primary,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              // Refresh users
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Search and Filter Section
          Container(
            padding: const EdgeInsets.all(16),
            color: Theme.of(context).colorScheme.surface,
            child: Column(
              children: [
                // Search Bar
                TextField(
                  controller: _searchController,
                  decoration: InputDecoration(
                    hintText: 'البحث في المستخدمين...',
                    prefixIcon: const Icon(Icons.search),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    filled: true,
                    fillColor: Theme.of(context).colorScheme.surfaceVariant,
                  ),
                  onChanged: (value) {
                    _filterUsers();
                  },
                ),
                const SizedBox(height: 12),
                // Role Filter
                Row(
                  children: [
                    Text(
                      'فلترة حسب الدور:',
                      style: Theme.of(context).textTheme.labelMedium,
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: DropdownButton<String>(
                        value: _selectedRole,
                        isExpanded: true,
                        items: const [
                          DropdownMenuItem(value: 'All', child: Text('الكل')),
                          DropdownMenuItem(value: 'admin', child: Text('مدير')),
                          DropdownMenuItem(value: 'volunteer', child: Text('متطوع')),
                          DropdownMenuItem(value: 'student', child: Text('طالب')),
                        ],
                        onChanged: (String? value) {
                          if (value != null) {
                            setState(() {
                              _selectedRole = value;
                            });
                            _filterUsers();
                          }
                        },
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                // Governorate Filter
                Row(
                  children: [
                    Text(
                      'فلترة حسب المحافظة:',
                      style: Theme.of(context).textTheme.labelMedium,
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: DropdownButton<String>(
                        value: _selectedGovernorate,
                        isExpanded: true,
                        items: const [
                          DropdownMenuItem(value: 'All', child: Text('الكل')),
                          DropdownMenuItem(value: 'القاهرة', child: Text('القاهرة')),
                          DropdownMenuItem(value: 'الجيزة', child: Text('الجيزة')),
                          DropdownMenuItem(value: 'الإسكندرية', child: Text('الإسكندرية')),
                          DropdownMenuItem(value: 'أسوان', child: Text('أسوان')),
                          DropdownMenuItem(value: 'الأقصر', child: Text('الأقصر')),
                        ],
                        onChanged: (String? value) {
                          if (value != null) {
                            setState(() {
                              _selectedGovernorate = value;
                            });
                            _filterUsers();
                          }
                        },
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                // University Filter
                Row(
                  children: [
                    Text(
                      'فلترة حسب الجامعة:',
                      style: Theme.of(context).textTheme.labelMedium,
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: DropdownButton<String>(
                        value: _selectedUniversity,
                        isExpanded: true,
                        items: const [
                          DropdownMenuItem(value: 'All', child: Text('الكل')),
                          DropdownMenuItem(value: 'جامعة القاهرة', child: Text('جامعة القاهرة')),
                          DropdownMenuItem(value: 'جامعة عين شمس', child: Text('جامعة عين شمس')),
                          DropdownMenuItem(value: 'جامعة الإسكندرية', child: Text('جامعة الإسكندرية')),
                          DropdownMenuItem(value: 'جامعة الأزهر', child: Text('جامعة الأزهر')),
                          DropdownMenuItem(value: 'جامعة أسوان', child: Text('جامعة أسوان')),
                        ],
                        onChanged: (String? value) {
                          if (value != null) {
                            setState(() {
                              _selectedUniversity = value;
                            });
                            _filterUsers();
                          }
                        },
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ).animate().fadeIn().slideY(begin: -0.2, end: 0),

            // Statistics Cards
            Container(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Expanded(
                    child: _buildStatCard(
                      'إجمالي المستخدمين',
                      _users.length.toString(),
                      Icons.people,
                      Colors.blue,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildStatCard(
                      'نتائج البحث',
                      _filteredUsers.length.toString(),
                      Icons.person_pin,
                      Colors.green,
                    ),
                  ),
                ],
              ),
            ).animate().fadeIn(delay: 200.ms).slideX(begin: -0.3, end: 0),

            // Users List
            Expanded(
              child: _isLoading
                  ? const Center(child: CircularProgressIndicator())
                  : RefreshIndicator(
                      onRefresh: _loadUsers,
                      child: _filteredUsers.isEmpty
                          ? const Center(
                              child: Text(
                                'لا توجد نتائج تطابق البحث',
                                style: TextStyle(fontSize: 16),
                              ),
                            )
                          : ListView.builder(
                              padding: const EdgeInsets.symmetric(horizontal: 16),
                              itemCount: _filteredUsers.length,
                              itemBuilder: (context, index) => _buildUserCard(context, _filteredUsers[index], index),
                            ),
                    ),
            ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          _showAddUserDialog(context);
        },
        icon: const Icon(Icons.person_add),
        label: const Text('إضافة مستخدم'),
      ).animate().scale(delay: 500.ms),
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Icon(
              icon,
              size: 32,
              color: color,
            ),
            const SizedBox(height: 8),
            Text(
              value,
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: color,
                  ),
            ),
            Text(
              title,
              style: Theme.of(context).textTheme.bodySmall,
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildUserCard(BuildContext context, Map<String, dynamic> user, int index) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: _getRoleColor(user['role']!),
          child: Text(
            user['name']![0],
            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
          ),
        ),
        title: Text(
          user['name']!,
          style: const TextStyle(fontWeight: FontWeight.w600),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(user['email']!),
            if (user['phone'] != null) Text('هاتف: ${user['phone']}'),
            if (user['university'] != null) Text('جامعة: ${user['university']}'),
            if (user['governorate'] != null) Text('محافظة: ${user['governorate']}'),
            const SizedBox(height: 4),
            Chip(
              label: Text(
                _getRoleDisplayName(user['role']!),
                style: const TextStyle(fontSize: 12),
              ),
              backgroundColor: _getRoleColor(user['role']!).withOpacity(0.2),
              materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
            ),
          ],
        ),
        trailing: PopupMenuButton(
          itemBuilder: (context) => [
            const PopupMenuItem(
              value: 'edit',
              child: Row(
                children: [
                  Icon(Icons.edit),
                  SizedBox(width: 8),
                  Text('تعديل'),
                ],
              ),
            ),
            const PopupMenuItem(
              value: 'role',
              child: Row(
                children: [
                  Icon(Icons.admin_panel_settings),
                  SizedBox(width: 8),
                  Text('تغيير الدور'),
                ],
              ),
            ),
            const PopupMenuItem(
              value: 'delete',
              child: Row(
                children: [
                  Icon(Icons.delete, color: Colors.red),
                  SizedBox(width: 8),
                  Text('حذف', style: TextStyle(color: Colors.red)),
                ],
              ),
            ),
          ],
          onSelected: (value) {
            switch (value) {
              case 'edit':
                _showEditUserDialog(context, Map<String, String>.from(user));
                break;
              case 'role':
                _showChangeRoleDialog(context, Map<String, String>.from(user));
                break;
              case 'delete':
                _showDeleteUserDialog(context, Map<String, String>.from(user));
                break;
            }
          },
        ),
        isThreeLine: true,
      ),
    ).animate().fadeIn(delay: Duration(milliseconds: 100 * index)).slideX(begin: 0.3, end: 0);
  }

  Color _getRoleColor(String role) {
    switch (role) {
      case 'admin':
        return Colors.red;
      case 'volunteer':
        return Colors.blue;
      case 'student':
        return Colors.green;
      default:
        return Colors.grey;
    }
  }

  String _getRoleDisplayName(String role) {
    switch (role) {
      case 'admin':
        return 'مدير';
      case 'volunteer':
        return 'متطوع';
      case 'student':
        return 'طالب';
      default:
        return role;
    }
  }

  void _showAddUserDialog(BuildContext context) {
    final nameController = TextEditingController();
    final emailController = TextEditingController();
    final phoneController = TextEditingController();
    final universityController = TextEditingController();
    final nationalIdController = TextEditingController();
    final passwordController = TextEditingController();
    String selectedRole = 'student';
    String selectedGovernorate = 'القاهرة';

    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setState) => AlertDialog(
          title: const Text('إضافة مستخدم جديد'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: nameController,
                  decoration: const InputDecoration(
                    labelText: 'الاسم *',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: emailController,
                  decoration: const InputDecoration(
                    labelText: 'البريد الإلكتروني *',
                    border: OutlineInputBorder(),
                  ),
                  keyboardType: TextInputType.emailAddress,
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: passwordController,
                  decoration: const InputDecoration(
                    labelText: 'كلمة المرور *',
                    border: OutlineInputBorder(),
                  ),
                  obscureText: true,
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: phoneController,
                  decoration: const InputDecoration(
                    labelText: 'رقم الهاتف *',
                    border: OutlineInputBorder(),
                  ),
                  keyboardType: TextInputType.phone,
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: universityController,
                  decoration: const InputDecoration(
                    labelText: 'الجامعة *',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: nationalIdController,
                  decoration: const InputDecoration(
                    labelText: 'الرقم القومي *',
                    border: OutlineInputBorder(),
                  ),
                  keyboardType: TextInputType.number,
                ),
                const SizedBox(height: 12),
                DropdownButtonFormField<String>(
                  decoration: const InputDecoration(
                    labelText: 'الدور',
                    border: OutlineInputBorder(),
                  ),
                  value: selectedRole,
                  items: const [
                    DropdownMenuItem(value: 'admin', child: Text('مدير')),
                    DropdownMenuItem(value: 'volunteer', child: Text('متطوع')),
                    DropdownMenuItem(value: 'student', child: Text('طالب')),
                  ],
                  onChanged: (value) {
                    if (value != null) {
                      setState(() {
                        selectedRole = value;
                      });
                    }
                  },
                ),
                const SizedBox(height: 12),
                DropdownButtonFormField<String>(
                  decoration: const InputDecoration(
                    labelText: 'المحافظة',
                    border: OutlineInputBorder(),
                  ),
                  value: selectedGovernorate,
                  items: const [
                    DropdownMenuItem(value: 'القاهرة', child: Text('القاهرة')),
                    DropdownMenuItem(value: 'الجيزة', child: Text('الجيزة')),
                    DropdownMenuItem(value: 'الإسكندرية', child: Text('الإسكندرية')),
                    DropdownMenuItem(value: 'أسوان', child: Text('أسوان')),
                    DropdownMenuItem(value: 'الأقصر', child: Text('الأقصر')),
                  ],
                  onChanged: (value) {
                    if (value != null) {
                      setState(() {
                        selectedGovernorate = value;
                      });
                    }
                  },
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('إلغاء'),
            ),
            TextButton(
              onPressed: () {
                if (nameController.text.isNotEmpty && 
                    emailController.text.isNotEmpty &&
                    passwordController.text.isNotEmpty &&
                    phoneController.text.isNotEmpty &&
                    universityController.text.isNotEmpty &&
                    nationalIdController.text.isNotEmpty) {
                  
                  final userData = {
                    'name': nameController.text,
                    'email': emailController.text,
                    'password': passwordController.text,
                    'phone': phoneController.text,
                    'university': universityController.text,
                    'nationalId': nationalIdController.text,
                    'role': selectedRole,
                    'governorate': selectedGovernorate,
                  };
                  
                  // TODO: Call create user API
                  Navigator.of(context).pop();
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('تم إنشاء المستخدم بنجاح')),
                  );
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('يرجى ملء جميع الحقول المطلوبة'),
                      backgroundColor: Colors.red,
                    ),
                  );
                }
              },
              child: const Text('إنشاء'),
            ),
          ],
        ),
      ),
    );
  }

  void _showEditUserDialog(BuildContext context, Map<String, String> user) {
    final nameController = TextEditingController(text: user['name']);
    final emailController = TextEditingController(text: user['email']);
    final phoneController = TextEditingController(text: user['phone'] ?? '');
    final universityController = TextEditingController(text: user['university'] ?? '');
    String selectedGovernorate = user['governorate'] ?? 'القاهرة';

    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setState) => AlertDialog(
          title: const Text('تعديل المستخدم'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: nameController,
                  decoration: const InputDecoration(
                    labelText: 'الاسم',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: emailController,
                  decoration: const InputDecoration(
                    labelText: 'البريد الإلكتروني',
                    border: OutlineInputBorder(),
                  ),
                  keyboardType: TextInputType.emailAddress,
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: phoneController,
                  decoration: const InputDecoration(
                    labelText: 'رقم الهاتف',
                    border: OutlineInputBorder(),
                  ),
                  keyboardType: TextInputType.phone,
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: universityController,
                  decoration: const InputDecoration(
                    labelText: 'الجامعة',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 12),
                DropdownButtonFormField<String>(
                  decoration: const InputDecoration(
                    labelText: 'المحافظة',
                    border: OutlineInputBorder(),
                  ),
                  value: selectedGovernorate,
                  items: const [
                    DropdownMenuItem(value: 'القاهرة', child: Text('القاهرة')),
                    DropdownMenuItem(value: 'الجيزة', child: Text('الجيزة')),
                    DropdownMenuItem(value: 'الإسكندرية', child: Text('الإسكندرية')),
                    DropdownMenuItem(value: 'أسوان', child: Text('أسوان')),
                    DropdownMenuItem(value: 'الأقصر', child: Text('الأقصر')),
                  ],
                  onChanged: (value) {
                    if (value != null) {
                      setState(() {
                        selectedGovernorate = value;
                      });
                    }
                  },
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('إلغاء'),
            ),
            TextButton(
              onPressed: () {
                final userData = {
                  'name': nameController.text,
                  'email': emailController.text,
                  'phone': phoneController.text,
                  'university': universityController.text,
                  'governorate': selectedGovernorate,
                };
                
                // TODO: Call update user API
                Navigator.of(context).pop();
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('تم تعديل بيانات المستخدم')),
                );
              },
              child: const Text('حفظ'),
            ),
          ],
        ),
      ),
    );
  }

  void _showChangeRoleDialog(BuildContext context, Map<String, String> user) {
    String selectedRole = user['role']!;
    
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('تغيير دور المستخدم'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('تغيير دور المستخدم: ${user['name']}'),
            const SizedBox(height: 16),
            DropdownButton<String>(
              value: selectedRole,
              isExpanded: true,
              items: const [
                DropdownMenuItem(value: 'Admin', child: Text('مدير')),
                DropdownMenuItem(value: 'Volunteer', child: Text('متطوع')),
                DropdownMenuItem(value: 'Student', child: Text('طالب')),
              ],
              onChanged: (String? value) {
                if (value != null) {
                  selectedRole = value;
                }
              },
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('إلغاء'),
          ),
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('تم تغيير دور المستخدم')),
              );
            },
            child: const Text('حفظ'),
          ),
        ],
      ),
    );
  }

  void _showDeleteUserDialog(BuildContext context, Map<String, String> user) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('حذف المستخدم'),
        content: Text('هل أنت متأكد من حذف المستخدم: ${user['name']}؟'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('إلغاء'),
          ),
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: const Text('تم حذف المستخدم'),
                  backgroundColor: Theme.of(context).colorScheme.error,
                ),
              );
            },
            style: TextButton.styleFrom(
              foregroundColor: Theme.of(context).colorScheme.error,
            ),
            child: const Text('حذف'),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }
}