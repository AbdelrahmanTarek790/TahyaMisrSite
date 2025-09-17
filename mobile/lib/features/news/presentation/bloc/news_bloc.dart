import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

import '../../domain/usecases/get_news_detail_usecase.dart';
import '../../domain/usecases/get_news_usecase.dart';
import 'news_event.dart';
import 'news_state.dart';

@injectable
class NewsBloc extends Bloc<NewsEvent, NewsState> {
  final GetNewsUseCase getNewsUseCase;
  final GetNewsDetailUseCase getNewsDetailUseCase;

  NewsBloc({required this.getNewsUseCase, required this.getNewsDetailUseCase})
      : super(const NewsState.initial()) {
    on<GetNews>(_onGetNews);
    on<RefreshNews>(_onRefreshNews);
    on<GetNewsById>(_onGetNewsById);
  }

  Future<void> _onGetNews(
    GetNews event,
    Emitter<NewsState> emit,
  ) async {
    emit(const NewsState.loading());

    final result = await getNewsUseCase(const NewsParams());

    result.fold(
      (failure) => emit(NewsState.error(message: failure.message)),
      (news) => emit(NewsState.loaded(news: news)),
    );
  }

  Future<void> _onRefreshNews(
    RefreshNews event,
    Emitter<NewsState> emit,
  ) async {
    add(const NewsEvent.getNews());
  }

  Future<void> _onGetNewsById(
    GetNewsById event,
    Emitter<NewsState> emit,
  ) async {
    emit(const NewsState.loading());
    final result =
        await getNewsDetailUseCase(GetNewsDetailParams(id: event.id));
    result.fold(
      (failure) => emit(NewsState.error(message: failure.message)),
      (news) => emit(NewsState.loaded(news: [news])),
    );
    
    add(const NewsEvent.getNews());
  }
}
