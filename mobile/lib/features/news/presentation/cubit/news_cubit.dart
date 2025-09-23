import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

import '../../domain/usecases/get_news_detail_usecase.dart';
import '../../domain/usecases/get_news_usecase.dart';
import '../bloc/news_state.dart';

@injectable
class NewsCubit extends Cubit<NewsState> {
  final GetNewsUseCase getNewsUseCase;
  final GetNewsDetailUseCase getNewsDetailUseCase;

  NewsCubit({
    required this.getNewsUseCase,
    required this.getNewsDetailUseCase,
  }) : super(const NewsState.initial());

  Future<void> getNews() async {
    emit(const NewsState.loading());

    final result = await getNewsUseCase(const NewsParams());

    result.fold(
      (failure) => emit(NewsState.error(message: failure.message)),
      (news) => emit(NewsState.loaded(news: news)),
    );
  }

  Future<void> refreshNews() async {
    getNews();
  }

  Future<void> getNewsById(String id) async {
    emit(const NewsState.loading());
    final result =
        await getNewsDetailUseCase(GetNewsDetailParams(id: id));
    result.fold(
      (failure) => emit(NewsState.error(message: failure.message)),
      (newDetails) => emit(NewsState.loadedDetails(newsDetails: newDetails)),
    );
  }
}