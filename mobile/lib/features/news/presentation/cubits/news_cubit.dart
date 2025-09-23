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
}