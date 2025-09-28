import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:injectable/injectable.dart';

import '../../data/models/news_model.dart';
import '../../data/repositories/news_repository.dart';

part 'news_state.dart';
part 'news_cubit.freezed.dart';

@injectable
class NewsCubit extends Cubit<NewsState> {
  final NewsRepository newsRepository;

  NewsCubit({required this.newsRepository}) : super(const NewsState.initial());

  Future<void> getNews({int page = 1, int limit = 10}) async {
    emit(const NewsState.loading());

    final result = await newsRepository.getNews(page: page, limit: limit);

    result.fold(
      (failure) => emit(NewsState.error(message: failure.message)),
      (news) => emit(NewsState.loaded(news: news)),
    );
  }

  Future<void> refreshNews() async {
    await getNews();
  }

  Future<void> getNewsById(String id) async {
    emit(const NewsState.loading());
    
    final result = await newsRepository.getNewsById(id);
    
    result.fold(
      (failure) => emit(NewsState.error(message: failure.message)),
      (newsDetails) => emit(NewsState.loadedDetails(newsDetails: newsDetails)),
    );
  }

  Future<void> getCachedNews() async {
    final result = await newsRepository.getCachedNews();
    
    result.fold(
      (failure) => emit(NewsState.error(message: failure.message)),
      (news) => emit(NewsState.loaded(news: news)),
    );
  }

  Future<void> createNews({
    required String title,
    required String content,
    required String imagePath,
  }) async {
    emit(const NewsState.loading());

    final result = await newsRepository.createNews(
      title: title,
      content: content,
      imagePath: imagePath,
    );

    result.fold(
          (failure) => emit(NewsState.error(message: failure.message)),
          (data) => emit( NewsState.newsCreated(news:data)),
    );
  }


  Future<void> updateNews({
    required String newsId,
    required String title,
    required String content,
    String? imagePath,
  }) async {
    emit(const NewsState.loading());

    final result = await newsRepository.updateNews(
      newsId: newsId,
      title: title,
      content: content,
      imagePath: imagePath,
    );

    result.fold(
          (failure) => emit(NewsState.error(message: failure.message)),
          (data) => emit( NewsState.newsUpdated(news:data)),
    );
  }


  Future<void> deleteNews(String newsId) async {
    emit(const NewsState.loading());

    final result = await newsRepository.deleteNews(newsId: newsId);

    result.fold(
          (failure) => emit(NewsState.error(message: failure.message)),
          (_) => emit( NewsState.deletingNews(newsId: newsId) ),
    );
  }
}