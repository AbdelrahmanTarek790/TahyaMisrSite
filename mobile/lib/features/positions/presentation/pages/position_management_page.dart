import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../../../../gen_l10n/app_localizations.dart';

class PositionManagementPage extends StatefulWidget {
  const PositionManagementPage({super.key});

  @override
  State<PositionManagementPage> createState() => _PositionManagementPageState();
}

class _PositionManagementPageState extends State<PositionManagementPage> {
  String _selectedGovernorate = 'All';
  final TextEditingController _searchController = TextEditingController();
  bool _isLoading = true;
  List<Map<String, dynamic>> _positions = [];

  @override
  void initState() {
    super.initState();
    _loadPositions();
  }

  Future<void> _loadPositions() async {
    setState(() {
      _isLoading = true;
    });

    // TODO: Replace with actual API call
    await Future.delayed(const Duration(seconds: 1));
    
    setState(() {
      _positions = [
        {
          'id': '1',
          'name': 'رئيس الفرع',
          'description': 'المسؤول عن إدارة الفرع بالكامل',
          'isGlobal': false,
          'governorate': 'القاهرة',
          'isActive': true,
        },
        {
          'id': '2', 
          'name': 'منسق الأنشطة',
          'description': 'تنسيق الأنشطة والفعاليات',
          'isGlobal': true,
          'governorate': null,
          'isActive': true,
        },
      ];
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('إدارة المناصب'),
        backgroundColor: Theme.of(context).colorScheme.primary,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadPositions,
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
                    hintText: 'البحث في المناصب...',
                    prefixIcon: const Icon(Icons.search),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    filled: true,
                    fillColor: Theme.of(context).colorScheme.surfaceVariant,
                  ),
                  onChanged: (value) {
                    // TODO: Implement search
                  },
                ),
                const SizedBox(height: 12),
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
                          DropdownMenuItem(value: 'Global', child: Text('عام (جميع المحافظات)')),
                        ],
                        onChanged: (String? value) {
                          if (value != null) {
                            setState(() {
                              _selectedGovernorate = value;
                            });
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
                    'إجمالي المناصب',
                    _positions.length.toString(),
                    Icons.work,
                    Colors.blue,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildStatCard(
                    'المناصب النشطة',
                    _positions.where((p) => p['isActive'] == true).length.toString(),
                    Icons.work_outline,
                    Colors.green,
                  ),
                ),
              ],
            ),
          ).animate().fadeIn(delay: 200.ms).slideX(begin: -0.3, end: 0),

          // Positions List
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : RefreshIndicator(
                    onRefresh: _loadPositions,
                    child: ListView.builder(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      itemCount: _positions.length,
                      itemBuilder: (context, index) => _buildPositionCard(context, _positions[index], index),
                    ),
                  ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          _showCreatePositionDialog(context);
        },
        icon: const Icon(Icons.add),
        label: const Text('إضافة منصب'),
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

  Widget _buildPositionCard(BuildContext context, Map<String, dynamic> position, int index) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: position['isGlobal'] ? Colors.purple : Colors.blue,
          child: Icon(
            position['isGlobal'] ? Icons.public : Icons.location_on,
            color: Colors.white,
          ),
        ),
        title: Text(
          position['name'],
          style: const TextStyle(fontWeight: FontWeight.w600),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (position['description'] != null)
              Text(position['description']),
            const SizedBox(height: 4),
            Row(
              children: [
                Chip(
                  label: Text(
                    position['isGlobal'] ? 'عام' : position['governorate'] ?? 'محلي',
                    style: const TextStyle(fontSize: 12),
                  ),
                  backgroundColor: (position['isGlobal'] ? Colors.purple : Colors.blue).withOpacity(0.2),
                  materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                ),
                const SizedBox(width: 8),
                Chip(
                  label: Text(
                    position['isActive'] ? 'نشط' : 'غير نشط',
                    style: const TextStyle(fontSize: 12),
                  ),
                  backgroundColor: (position['isActive'] ? Colors.green : Colors.red).withOpacity(0.2),
                  materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                ),
              ],
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
                _showEditPositionDialog(context, position);
                break;
              case 'delete':
                _showDeletePositionDialog(context, position);
                break;
            }
          },
        ),
        isThreeLine: true,
      ),
    ).animate().fadeIn(delay: Duration(milliseconds: 100 * index)).slideX(begin: 0.3, end: 0);
  }

  void _showCreatePositionDialog(BuildContext context) {
    final nameController = TextEditingController();
    final descriptionController = TextEditingController();
    bool isGlobal = false;
    String? selectedGovernorate;

    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setState) => AlertDialog(
          title: const Text('إضافة منصب جديد'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: nameController,
                  decoration: const InputDecoration(
                    labelText: 'اسم المنصب *',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: descriptionController,
                  decoration: const InputDecoration(
                    labelText: 'وصف المنصب',
                    border: OutlineInputBorder(),
                  ),
                  maxLines: 3,
                ),
                const SizedBox(height: 16),
                CheckboxListTile(
                  title: const Text('منصب عام (جميع المحافظات)'),
                  value: isGlobal,
                  onChanged: (value) {
                    setState(() {
                      isGlobal = value ?? false;
                      if (isGlobal) {
                        selectedGovernorate = null;
                      }
                    });
                  },
                ),
                if (!isGlobal) ...[
                  const SizedBox(height: 8),
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
                    ],
                    onChanged: (value) {
                      setState(() {
                        selectedGovernorate = value;
                      });
                    },
                  ),
                ],
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
                if (nameController.text.isNotEmpty) {
                  // TODO: Create position via API
                  Navigator.of(context).pop();
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('تم إنشاء المنصب بنجاح')),
                  );
                  _loadPositions();
                }
              },
              child: const Text('إنشاء'),
            ),
          ],
        ),
      ),
    );
  }

  void _showEditPositionDialog(BuildContext context, Map<String, dynamic> position) {
    final nameController = TextEditingController(text: position['name']);
    final descriptionController = TextEditingController(text: position['description'] ?? '');
    bool isGlobal = position['isGlobal'];
    String? selectedGovernorate = position['governorate'];

    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setState) => AlertDialog(
          title: const Text('تعديل المنصب'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: nameController,
                  decoration: const InputDecoration(
                    labelText: 'اسم المنصب *',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: descriptionController,
                  decoration: const InputDecoration(
                    labelText: 'وصف المنصب',
                    border: OutlineInputBorder(),
                  ),
                  maxLines: 3,
                ),
                const SizedBox(height: 16),
                CheckboxListTile(
                  title: const Text('منصب عام (جميع المحافظات)'),
                  value: isGlobal,
                  onChanged: (value) {
                    setState(() {
                      isGlobal = value ?? false;
                      if (isGlobal) {
                        selectedGovernorate = null;
                      }
                    });
                  },
                ),
                if (!isGlobal) ...[
                  const SizedBox(height: 8),
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
                    ],
                    onChanged: (value) {
                      setState(() {
                        selectedGovernorate = value;
                      });
                    },
                  ),
                ],
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
                if (nameController.text.isNotEmpty) {
                  // TODO: Update position via API
                  Navigator.of(context).pop();
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('تم تحديث المنصب بنجاح')),
                  );
                  _loadPositions();
                }
              },
              child: const Text('حفظ'),
            ),
          ],
        ),
      ),
    );
  }

  void _showDeletePositionDialog(BuildContext context, Map<String, dynamic> position) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('حذف المنصب'),
        content: Text('هل أنت متأكد من حذف المنصب: ${position['name']}؟'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('إلغاء'),
          ),
          TextButton(
            onPressed: () {
              // TODO: Delete position via API
              Navigator.of(context).pop();
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: const Text('تم حذف المنصب'),
                  backgroundColor: Theme.of(context).colorScheme.error,
                ),
              );
              _loadPositions();
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