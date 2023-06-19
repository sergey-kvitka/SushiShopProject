package com.kvitka.sushishop.dto;

import com.kvitka.sushishop.entities.Order;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
public class OrderDto {
    private Long id;
    private Long userId;
    private String username;
    private String firstName;
    private String lastName;
    private Date date;
    private List<OrderItem> items;
    private String phoneNumber;
    private String address;
    private String comment;

    @Data
    @AllArgsConstructor
    public static class OrderItem {
        private Long itemId;
        private String name;
        private String category;
        private Double price;
        private Integer amount;
    }

    public Order toOrder() {
        JSONArray jsonArray = new JSONArray();
        JSONObject jsonObject;
        for (OrderItem orderItem : getItems()) {
            jsonObject = new JSONObject();
            jsonObject.put("itemId", orderItem.getItemId());
            jsonObject.put("name", orderItem.getName());
            jsonObject.put("category", orderItem.getCategory());
            jsonObject.put("price", orderItem.getPrice());
            jsonObject.put("amount", orderItem.getAmount());
            jsonArray.put(jsonObject);
        }
        return new Order(getId(), getUserId(), getUsername(), getFirstName(), getLastName(),
                getDate(), jsonArray.toString(), getPhoneNumber(), getAddress(), getComment());
    }

    public static OrderDto from(Order order) {
        JSONArray jsonArray = new JSONArray(order.getOrderData());
        List<OrderItem> items = new ArrayList<>();
        int length = jsonArray.length();
        JSONObject jsonObject;
        for (int i = 0; i < length; i++) {
            jsonObject = jsonArray.getJSONObject(i);
            items.add(new OrderItem(
                    jsonObject.getLong("itemId"),
                    jsonObject.getString("name"),
                    jsonObject.getString("category"),
                    jsonObject.getDouble("price"),
                    jsonObject.getInt("amount")));
        }
        return new OrderDto(order.getId(), order.getUserId(), order.getUsername(),
                order.getFirstName(), order.getLastName(), order.getDate(), items, order.getPhoneNumber(),
                order.getAddress(), order.getComment());
    }
}
