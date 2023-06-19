package com.kvitka.sushishop.services;

import com.kvitka.sushishop.dto.OrderDto;
import com.kvitka.sushishop.repositories.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<OrderDto> getOrders() {
        return orderRepository.findAll()
                .stream().map(OrderDto::from).collect(Collectors.toList());
    }

    public List<OrderDto> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId)
                .stream().map(OrderDto::from).collect(Collectors.toList());
    }

    public void saveOrder(OrderDto orderDto) {
        orderRepository.save(orderDto.toOrder());
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
}
