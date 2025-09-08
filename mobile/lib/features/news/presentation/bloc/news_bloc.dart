import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

import '../../../../core/usecases/usecase.dart';
import '../../domain/usecases/get_news_usecase.dart';
import 'news_event.dart';
import 'news_state.dart';

@injectable
class NewsBloc extends Bloc<NewsEvent, NewsState> {
  final GetNewsUseCase getNewsUseCase;

  NewsBloc({
    required this.getNewsUseCase,
  }) : super(const NewsState.initial()) {
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
    // This would need a separate usecase for getting single news item
    // For now, just refresh the list
    add(const NewsEvent.getNews());
  }
}