import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:hive/hive.dart';

import '../../../../core/constants/app_constants.dart';
import '../../../../core/error/exceptions.dart';
import '../models/user_model.dart';

class AuthLocalStorage {
  final FlutterSecureStorage secureStorage;
  final Box authBox;

  AuthLocalStorage(this.secureStorage, this.authBox);

  Future<void> cacheToken(String token) async {
    try {
      await secureStorage.write(key: AppConstants.tokenKey, value: token);
    } catch (e) {
      throw CacheException('Failed to cache token: $e');
    }
  }

  Future<String?> getToken() async {
    try {
      return await secureStorage.read(key: AppConstants.tokenKey);
    } catch (e) {
      throw CacheException('Failed to get token: $e');
    }
  }

  Future<void> clearToken() async {
    try {
      await secureStorage.delete(key: AppConstants.tokenKey);
    } catch (e) {
      throw CacheException('Failed to clear token: $e');
    }
  }

  Future<void> cacheUser(UserModel user) async {
    try {
      await authBox.put(AppConstants.userKey, jsonEncode(user.toJson()));
    } catch (e) {
      throw CacheException('Failed to cache user: $e');
    }
  }

  Future<UserModel?> getCachedUser() async {
    try {
      final userJson = authBox.get(AppConstants.userKey);
      if (userJson != null) {
        return UserModel.fromJson(jsonDecode(userJson));
      }
      return null;
    } catch (e) {
      throw CacheException('Failed to get cached user: $e');
    }
  }

  Future<void> clearUser() async {
    try {
      await authBox.delete(AppConstants.userKey);
    } catch (e) {
      throw CacheException('Failed to clear user: $e');
    }
  }

  Future<bool> isLoggedIn() async {
    try {
      final token = await getToken();
      return token != null && token.isNotEmpty;
    } catch (e) {
      return false;
    }
  }
}