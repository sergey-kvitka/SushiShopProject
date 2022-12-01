package com.kvitka.sushishop.interfaces;

public interface SaveOrGetMethod<T> {
    T saveOrGet(T entity);
}
